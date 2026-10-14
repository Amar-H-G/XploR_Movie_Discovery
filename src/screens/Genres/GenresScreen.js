// CineVerse — Genres Screen (movie and TV genre browser)
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {getMovieGenres, getTVGenres} from '../../api/tmdbService';
import {ErrorState} from '../../components/states/StateComponents';
import {ROUTES} from '../../navigation/AppNavigator';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const GENRE_COLORS = [
  ['#E50914', '#8B0000'],
  ['#2196F3', '#0D47A1'],
  ['#4CAF50', '#1B5E20'],
  ['#FF9800', '#E65100'],
  ['#9C27B0', '#4A148C'],
  ['#00BCD4', '#006064'],
  ['#F44336', '#B71C1C'],
  ['#3F51B5', '#1A237E'],
  ['#009688', '#004D40'],
  ['#FF5722', '#BF360C'],
  ['#607D8B', '#263238'],
  ['#795548', '#3E2723'],
  ['#CDDC39', '#827717'],
  ['#FFC107', '#FF6F00'],
  ['#E91E63', '#880E4F'],
  ['#8BC34A', '#33691E'],
  ['#00ACC1', '#006064'],
  ['#AB47BC', '#4A148C'],
  ['#26A69A', '#004D40'],
];

function GenreCard({genre, onPress, colorPair, index}) {
  const [c1, c2] = colorPair;
  return (
    <TouchableOpacity
      style={styles.genreCard}
      onPress={() => onPress(genre)}
      activeOpacity={0.8}
      accessibilityLabel={genre.name}
      accessibilityRole="button">
      <LinearGradient
        colors={[c1, c2]}
        style={styles.genreGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Icon
          name="film-outline"
          size={28}
          color="rgba(255,255,255,0.5)"
          style={styles.genreIcon}
        />
        <Text style={styles.genreName}>{genre.name}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function GenresScreen({navigation}) {
  const [movieGenres, setMovieGenres] = useState([]);
  const [tvGenres, setTVGenres] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      const [movieRes, tvRes] = await Promise.all([
        getMovieGenres(controller.signal),
        getTVGenres(controller.signal),
      ]);
      setMovieGenres(movieRes.data.genres || []);
      setTVGenres(tvRes.data.genres || []);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleGenrePress = useCallback(
    (genre, mediaType) => {
      navigation.navigate(ROUTES.GENRE_LIST, {
        genreId: genre.id,
        title: genre.name,
        mediaType,
      });
    },
    [navigation],
  );

  const genres = activeTab === 'movies' ? movieGenres : tvGenres;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Genres</Text>
        <View style={styles.tabs}>
          {[
            {key: 'movies', label: 'Movies'},
            {key: 'tv', label: 'TV Shows'},
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}>
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === tab.key && styles.activeTabLabel,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading ? (
        <View style={styles.loadingGrid}>
          {Array.from({length: 12}).map((_, i) => (
            <View key={i} style={[styles.genreCard, styles.skeletonCard]} />
          ))}
        </View>
      ) : (
        <FlatList
          data={genres}
          keyExtractor={g => `genre_${g.id}`}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => (
            <GenreCard
              genre={item}
              index={index}
              colorPair={GENRE_COLORS[index % GENRE_COLORS.length]}
              onPress={g =>
                handleGenrePress(g, activeTab === 'movies' ? 'movie' : 'tv')
              }
            />
          )}
        />
      )}
    </View>
  );
}

const CARD_WIDTH = (SCREEN_WIDTH - Spacing.screenPadding * 2 - Spacing.sm) / 2;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.background},
  header: {
    paddingTop: 50,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  headerTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    fontSize: 24,
  },
  tabs: {flexDirection: 'row', gap: Spacing.sm},
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
  },
  activeTab: {backgroundColor: Colors.accent, borderColor: Colors.accent},
  tabLabel: {color: Colors.textSecondary, fontSize: 14, fontWeight: '600'},
  activeTabLabel: {color: '#fff'},
  grid: {padding: Spacing.screenPadding, gap: Spacing.sm},
  row: {gap: Spacing.sm},
  genreCard: {
    width: CARD_WIDTH,
    height: 90,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  skeletonCard: {backgroundColor: Colors.surfaceElevated},
  genreGradient: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  genreIcon: {position: 'absolute', top: 10, right: 10},
  genreName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.screenPadding,
    gap: Spacing.sm,
  },
});
