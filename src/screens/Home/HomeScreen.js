// CineVerse — Home Screen
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing} from '../../theme';

import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  getPopularTV,
  getTrendingTV,
} from '../../api/tmdbService';

import MovieCard from '../../components/movie/MovieCard';
import HeroCard from '../../components/movie/HeroCard';
import TVCard from '../../components/tv/TVCard';
import SectionHeader from '../../components/common/SectionHeader';
import {
  MovieRailSkeleton,
  HeroCardSkeleton,
} from '../../components/skeletons/Skeletons';
import {ErrorState} from '../../components/states/StateComponents';
import {ROUTES} from '../../navigation/AppNavigator';

function HomeScreen({navigation}) {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = useCallback(async signal => {
    setError(null);
    try {
      const [
        trendingRes,
        popularRes,
        topRatedRes,
        upcomingRes,
        nowPlayingRes,
        popularTVRes,
        trendingTVRes,
      ] = await Promise.all([
        getTrendingMovies(signal),
        getPopularMovies(1, signal),
        getTopRatedMovies(1, signal),
        getUpcomingMovies(1, signal),
        getNowPlayingMovies(1, signal),
        getPopularTV(1, signal),
        getTrendingTV(signal),
      ]);

      setTrending(trendingRes.data.results?.slice(0, 8) || []);
      setPopular(popularRes.data.results?.slice(0, 10) || []);
      setTopRated(topRatedRes.data.results?.slice(0, 10) || []);
      setUpcoming(upcomingRes.data.results?.slice(0, 10) || []);
      setNowPlaying(nowPlayingRes.data.results?.slice(0, 10) || []);
      setPopularTV(popularTVRes.data.results?.slice(0, 10) || []);
      setTrendingTV(trendingTVRes.data.results?.slice(0, 5) || []);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadAll(controller.signal);
    return () => controller.abort();
  }, [loadAll]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAll();
  }, [loadAll]);

  const goToMovie = useCallback(
    item => {
      navigation.navigate(ROUTES.MOVIE_DETAILS, {
        movieId: item.id,
        movie: item,
      });
    },
    [navigation],
  );

  const goToTV = useCallback(
    item => {
      navigation.navigate(ROUTES.TV_DETAILS, {seriesId: item.id, show: item});
    },
    [navigation],
  );

  const goToSearch = useCallback(() => {
    navigation.navigate('SearchTab');
  }, [navigation]);

  const navigateFromTrending = useCallback(
    item => {
      if (item.media_type === 'tv') {
        goToTV(item);
      } else {
        goToMovie(item);
      }
    },
    [goToMovie, goToTV],
  );

  if (error && !loading) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.background}
        />
        <ErrorState
          message={error}
          onRetry={() => {
            setLoading(true);
            loadAll();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }>
        {/* ─── Header ──────────────────────────────────────── */}
        <LinearGradient
          colors={[Colors.accent + '22', Colors.background]}
          style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appName}>CINEVERSE</Text>
              <Text style={styles.headerSubtitle}>
                Discover your next watch
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notifButton}
              accessibilityLabel="Search"
              onPress={goToSearch}>
              <Icon
                name="search-outline"
                size={22}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={goToSearch} activeOpacity={0.8}>
            <View style={styles.fakeSearchBar} pointerEvents="none">
              <Icon name="search-outline" size={16} color={Colors.textMuted} />
              <Text style={styles.fakeSearchText}>
                Search movies, shows, people…
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* ─── Hero Carousel (Trending All) ─────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Trending Today"
            onSeeAll={() => navigation.navigate(ROUTES.GENRES)}
          />
          {loading ? (
            <View style={styles.heroPlaceholder}>
              <HeroCardSkeleton />
            </View>
          ) : (
            <FlatList
              data={trending.slice(0, 5)}
              keyExtractor={item => `trending_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.heroRail}
              renderItem={({item}) => (
                <HeroCard item={item} onPress={navigateFromTrending} />
              )}
              snapToInterval={Spacing.screenPadding * 2 + 360}
              decelerationRate="fast"
            />
          )}
        </View>

        {/* ─── Now Playing ──────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="Now Playing" />
          {loading ? (
            <MovieRailSkeleton count={4} />
          ) : (
            <FlatList
              data={nowPlaying}
              keyExtractor={item => `nowplaying_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
              renderItem={({item}) => (
                <MovieCard item={item} onPress={goToMovie} />
              )}
            />
          )}
        </View>

        {/* ─── Popular Movies ──────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Popular Movies"
            onSeeAll={() =>
              navigation.navigate(ROUTES.GENRE_LIST, {
                title: 'Popular Movies',
                listType: 'popular_movies',
              })
            }
          />
          {loading ? (
            <MovieRailSkeleton count={4} />
          ) : (
            <FlatList
              data={popular}
              keyExtractor={item => `popular_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
              renderItem={({item}) => (
                <MovieCard item={item} onPress={goToMovie} />
              )}
            />
          )}
        </View>

        {/* ─── Top Rated ────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Top Rated"
            onSeeAll={() =>
              navigation.navigate(ROUTES.GENRE_LIST, {
                title: 'Top Rated Movies',
                listType: 'top_rated_movies',
              })
            }
          />
          {loading ? (
            <MovieRailSkeleton count={4} />
          ) : (
            <FlatList
              data={topRated}
              keyExtractor={item => `toprated_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
              renderItem={({item}) => (
                <MovieCard item={item} onPress={goToMovie} />
              )}
            />
          )}
        </View>

        {/* ─── Upcoming ─────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="Coming Soon" />
          {loading ? (
            <MovieRailSkeleton count={4} />
          ) : (
            <FlatList
              data={upcoming}
              keyExtractor={item => `upcoming_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
              renderItem={({item}) => (
                <MovieCard item={item} onPress={goToMovie} />
              )}
            />
          )}
        </View>

        {/* ─── Popular TV ───────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Popular TV Shows"
            onSeeAll={() =>
              navigation.navigate(ROUTES.GENRE_LIST, {
                title: 'Popular TV Shows',
                listType: 'popular_tv',
              })
            }
          />
          {loading ? (
            <MovieRailSkeleton count={4} />
          ) : (
            <FlatList
              data={popularTV}
              keyExtractor={item => `populartv_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
              renderItem={({item}) => <TVCard item={item} onPress={goToTV} />}
            />
          )}
        </View>

        {/* ─── Trending TV ──────────────────────────────────── */}
        <View style={[styles.section, styles.lastSection]}>
          <SectionHeader title="Trending TV Today" />
          {loading ? (
            <MovieRailSkeleton count={4} />
          ) : (
            <FlatList
              data={trendingTV}
              keyExtractor={item => `trendingtv_${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
              renderItem={({item}) => <TVCard item={item} onPress={goToTV} />}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.base,
    gap: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.accent,
    letterSpacing: 3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 24,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xs,
  },
  fakeSearchText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  section: {
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  lastSection: {
    marginBottom: Spacing.base,
  },
  rail: {
    paddingHorizontal: Spacing.screenPadding,
  },
  heroRail: {
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.base,
  },
  heroPlaceholder: {
    paddingHorizontal: Spacing.screenPadding,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default HomeScreen;
