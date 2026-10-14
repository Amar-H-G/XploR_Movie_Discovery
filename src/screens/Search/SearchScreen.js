// CineVerse — Search Screen
import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {
  searchMovies,
  searchTV,
  searchPerson,
  multiSearch,
} from '../../api/tmdbService';
import {buildPosterUrl, buildProfileUrl} from '../../api/imageService';
import SearchBar from '../../components/common/SearchBar';
import {SearchResultSkeleton} from '../../components/skeletons/Skeletons';
import {
  NoResultsState,
  ErrorState,
} from '../../components/states/StateComponents';
import {
  getTitle,
  getReleaseDate,
  getYear,
  formatRating,
  debounce,
} from '../../utils/helpers';
import {ROUTES} from '../../navigation/AppNavigator';

const TABS = [
  {key: 'all', label: 'All'},
  {key: 'movie', label: 'Movies'},
  {key: 'tv', label: 'TV Shows'},
  {key: 'person', label: 'People'},
];

function SearchResultItem({item, onPress}) {
  const isMovie = item.media_type === 'movie' || item.title;
  const isTV = item.media_type === 'tv' || (item.name && !item.known_for);
  const isPerson = item.media_type === 'person' || !!item.known_for;

  const title = getTitle(item);
  const year = getYear(getReleaseDate(item));
  const rating = item.vote_average ? formatRating(item.vote_average) : null;

  let thumbUrl = null;
  if (isPerson) {
    thumbUrl = buildProfileUrl(item.profile_path);
  } else {
    thumbUrl = buildPosterUrl(item.poster_path);
  }

  let typeLabel = 'Movie';
  let typeColor = Colors.accent;
  if (item.media_type === 'tv' || (item.name && item.first_air_date)) {
    typeLabel = 'TV Show';
    typeColor = Colors.accentBlue;
  } else if (isPerson) {
    typeLabel = 'Person';
    typeColor = '#9C27B0';
  }

  return (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      accessibilityLabel={`${title}${year ? `, ${year}` : ''}`}
      accessibilityRole="button">
      <View style={styles.thumb}>
        {thumbUrl ? (
          <FastImage
            source={{uri: thumbUrl, priority: FastImage.priority.normal}}
            style={[styles.thumbImage, isPerson && styles.thumbRound]}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View
            style={[
              styles.thumbImage,
              styles.thumbPlaceholder,
              isPerson && styles.thumbRound,
            ]}>
            <Icon
              name={isPerson ? 'person-outline' : 'film-outline'}
              size={24}
              color={Colors.textMuted}
            />
          </View>
        )}
      </View>
      <View style={styles.resultInfo}>
        <View style={styles.resultHeader}>
          <View
            style={[
              styles.typeBadge,
              {backgroundColor: typeColor + '33', borderColor: typeColor},
            ]}>
            <Text style={[styles.typeLabel, {color: typeColor}]}>
              {typeLabel}
            </Text>
          </View>
          {rating && (
            <View style={styles.ratingRow}>
              <Icon name="star" size={10} color={Colors.accentGold} />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          )}
        </View>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {title}
        </Text>
        {year ? <Text style={styles.resultYear}>{year}</Text> : null}
        {isPerson && item.known_for_department ? (
          <Text style={styles.resultYear}>{item.known_for_department}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen({navigation}) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const abortRef = useRef(null);

  const doSearch = useCallback(async (q, tab, p = 1, append = false) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      let res;
      switch (tab) {
        case 'movie':
          res = await searchMovies(q, p, signal);
          res.data.results = res.data.results.map(r => ({
            ...r,
            media_type: 'movie',
          }));
          break;
        case 'tv':
          res = await searchTV(q, p, signal);
          res.data.results = res.data.results.map(r => ({
            ...r,
            media_type: 'tv',
          }));
          break;
        case 'person':
          res = await searchPerson(q, p, signal);
          res.data.results = res.data.results.map(r => ({
            ...r,
            media_type: 'person',
          }));
          break;
        default:
          res = await multiSearch(q, p, signal);
      }

      const newResults = res.data.results || [];
      setTotalPages(res.data.total_pages || 1);
      setPage(p);

      if (append) {
        setResults(prev => [...prev, ...newResults]);
      } else {
        setResults(newResults);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((q, tab) => doSearch(q, tab), 400),
    [doSearch],
  );

  useEffect(() => {
    if (query.trim().length >= 2) {
      debouncedSearch(query, activeTab);
    } else {
      setResults([]);
    }
  }, [query, activeTab, debouncedSearch]);

  const handleItemPress = useCallback(
    item => {
      Keyboard.dismiss();
      const mType =
        item.media_type || (item.title ? 'movie' : item.name ? 'tv' : 'person');
      if (mType === 'movie') {
        navigation.navigate(ROUTES.MOVIE_DETAILS, {
          movieId: item.id,
          movie: item,
        });
      } else if (mType === 'tv') {
        navigation.navigate(ROUTES.TV_DETAILS, {seriesId: item.id, show: item});
      } else if (mType === 'person') {
        navigation.navigate(ROUTES.PERSON_DETAILS, {
          personId: item.id,
          person: item,
        });
      }
    },
    [navigation],
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && page < totalPages && query.trim().length >= 2) {
      doSearch(query, activeTab, page + 1, true);
    }
  }, [loadingMore, page, totalPages, query, activeTab, doSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  const handleTabChange = useCallback(tab => {
    setActiveTab(tab);
    setResults([]);
    setPage(1);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={handleClear}
          autoFocus={false}
        />
        {/* Tabs */}
        <FlatList
          data={TABS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={t => t.key}
          contentContainerStyle={styles.tabs}
          renderItem={({item: tab}) => (
            <TouchableOpacity
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => handleTabChange(tab.key)}>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.key && styles.activeTabLabel,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Results */}
      {loading ? (
        <SearchResultSkeleton count={6} />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={() => doSearch(query, activeTab)}
        />
      ) : results.length === 0 && query.trim().length >= 2 ? (
        <NoResultsState query={query} />
      ) : results.length === 0 ? (
        <View style={styles.emptyPrompt}>
          <Icon name="search-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Search CineVerse</Text>
          <Text style={styles.emptyMsg}>Find movies, TV shows, and people</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, idx) => `result_${item.id}_${idx}`}
          renderItem={({item}) => (
            <SearchResultItem item={item} onPress={handleItemPress} />
          )}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
          ListFooterComponent={
            loadingMore ? <SearchResultSkeleton count={2} /> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.background},
  header: {
    paddingTop: 50,
    backgroundColor: Colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
  },
  tabs: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  activeTab: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  tabLabel: {color: Colors.textSecondary, fontSize: 13, fontWeight: '500'},
  activeTabLabel: {color: Colors.textPrimary, fontWeight: '700'},
  resultsList: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xs,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
    gap: Spacing.md,
  },
  thumb: {
    width: 60,
    height: 90,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
    flexShrink: 0,
  },
  thumbImage: {width: '100%', height: '100%'},
  thumbRound: {borderRadius: 30, width: 60, height: 60},
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  resultInfo: {flex: 1, paddingTop: 4, gap: 4},
  resultHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  typeLabel: {fontSize: 10, fontWeight: '700', letterSpacing: 0.5},
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 3},
  ratingText: {color: Colors.accentGold, fontSize: 11, fontWeight: '700'},
  resultTitle: {
    ...Typography.cardTitle,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  resultYear: {...Typography.caption, color: Colors.textMuted},
  emptyPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing['3xl'],
  },
  emptyTitle: {...Typography.sectionTitle, color: Colors.textPrimary},
  emptyMsg: {color: Colors.textMuted, fontSize: 14, textAlign: 'center'},
});
