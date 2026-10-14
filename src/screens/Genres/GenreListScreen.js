// CineVerse — Genre List Screen (paginated discover by genre)
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing, Typography} from '../../theme';
import {
  discoverMovies,
  discoverTV,
  getPopularMovies,
  getTopRatedMovies,
} from '../../api/tmdbService';
import MovieCard from '../../components/movie/MovieCard';
import TVCard from '../../components/tv/TVCard';
import {ErrorState, EmptyState} from '../../components/states/StateComponents';
import {ROUTES} from '../../navigation/AppNavigator';
import {deduplicateById} from '../../utils/helpers';

const CARD_GAP = 12;

export default function GenreListScreen({route, navigation}) {
  const {genreId, title, mediaType = 'movie', listType} = route.params || {};

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = useCallback(
    async (p = 1, append = false) => {
      const controller = new AbortController();
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        let res;
        if (listType === 'popular_movies') {
          res = await getPopularMovies(p, controller.signal);
        } else if (listType === 'top_rated_movies') {
          res = await getTopRatedMovies(p, controller.signal);
        } else if (listType === 'popular_tv') {
          res = await discoverTV(
            {sort_by: 'popularity.desc', page: p},
            controller.signal,
          );
        } else if (genreId) {
          if (mediaType === 'tv') {
            res = await discoverTV(
              {with_genres: genreId, page: p},
              controller.signal,
            );
          } else {
            res = await discoverMovies(
              {with_genres: genreId, page: p},
              controller.signal,
            );
          }
        } else {
          res = await discoverMovies(
            {sort_by: 'popularity.desc', page: p},
            controller.signal,
          );
        }

        const results = res.data.results || [];
        setTotalPages(res.data.total_pages || 1);
        setPage(p);

        if (append) {
          setItems(prev => deduplicateById([...prev, ...results]));
        } else {
          setItems(results);
        }
      } catch (err) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [genreId, mediaType, listType],
  );

  useEffect(() => {
    fetchItems(1, false);
  }, [fetchItems]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && page < totalPages) {
      fetchItems(page + 1, true);
    }
  }, [loadingMore, page, totalPages, fetchItems]);

  const goToItem = useCallback(
    item => {
      if (mediaType === 'tv' || listType === 'popular_tv') {
        navigation.navigate(ROUTES.TV_DETAILS, {seriesId: item.id, show: item});
      } else {
        navigation.navigate(ROUTES.MOVIE_DETAILS, {
          movieId: item.id,
          movie: item,
        });
      }
    },
    [navigation, mediaType, listType],
  );

  const isTV = mediaType === 'tv' || listType === 'popular_tv';

  const renderItem = useCallback(
    ({item}) =>
      isTV ? (
        <TVCard item={item} onPress={goToItem} style={styles.gridCard} />
      ) : (
        <MovieCard item={item} onPress={goToItem} style={styles.gridCard} />
      ),
    [isTV, goToItem],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
          accessibilityRole="button">
          <Icon name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || 'Discover'}
        </Text>
        <View style={{width: 40}} />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchItems(1)} />
      ) : items.length === 0 ? (
        <EmptyState
          icon="film-outline"
          title="No content found"
          message="Try a different genre."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, idx) => `genre_item_${item.id}_${idx}`}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={renderItem}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.accent} />
              </View>
            ) : null
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
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  grid: {padding: Spacing.screenPadding, gap: CARD_GAP},
  row: {gap: CARD_GAP, justifyContent: 'flex-start'},
  gridCard: {marginRight: 0},
  footerLoader: {paddingVertical: Spacing.base, alignItems: 'center'},
});
