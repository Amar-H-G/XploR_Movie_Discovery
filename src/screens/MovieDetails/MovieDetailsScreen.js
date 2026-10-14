// CineVerse — Movie Details Screen
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Linking,
  Share,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  getMovieSimilar,
  getMovieRecommendations,
} from '../../api/tmdbService';
import {
  buildBackdropUrl,
  buildPosterUrl,
  buildYouTubeThumbnail,
} from '../../api/imageService';
import {
  formatRuntime,
  formatDate,
  formatRating,
  formatVoteCount,
  formatCurrency,
  getRatingColor,
} from '../../utils/helpers';
import MovieCard from '../../components/movie/MovieCard';
import PersonCard from '../../components/person/PersonCard';
import {DetailsSkeleton} from '../../components/skeletons/Skeletons';
import {ErrorState} from '../../components/states/StateComponents';
import useFavorites from '../../hooks/useFavorites';
import useWatchlist from '../../hooks/useWatchlist';
import {ROUTES} from '../../navigation/AppNavigator';

const BACKDROP_HEIGHT = 240;

export default function MovieDetailsScreen({route, navigation}) {
  const {movieId} = route.params;
  const [movie, setMovie] = useState(route.params.movie || null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const movieItem = movie ? {...movie, media_type: 'movie'} : null;
  const {favorited, toggleFavorite} = useFavorites(movieItem);
  const {inWatchlist, toggleWatchlist} = useWatchlist(movieItem);

  const load = useCallback(async () => {
    const controller = new AbortController();
    setError(null);
    setLoading(true);

    try {
      const [detailsRes, creditsRes, videosRes, similarRes, recsRes] =
        await Promise.all([
          getMovieDetails(movieId, controller.signal),
          getMovieCredits(movieId, controller.signal),
          getMovieVideos(movieId, controller.signal),
          getMovieSimilar(movieId, 1, controller.signal),
          getMovieRecommendations(movieId, 1, controller.signal),
        ]);

      setMovie(detailsRes.data);
      setCredits(creditsRes.data);

      const youtubeVideos = (videosRes.data.results || []).filter(
        v =>
          v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
      );
      setVideos(youtubeVideos.slice(0, 5));

      setSimilar((similarRes.data.results || []).slice(0, 10));
      setRecommendations((recsRes.data.results || []).slice(0, 10));
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      setError(err.message || 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleShare = useCallback(async () => {
    if (!movie) {
      return;
    }
    try {
      await Share.share({
        message: `Check out "${
          movie.title
        }" on CineVerse! Rating: ${formatRating(movie.vote_average)}/10`,
      });
    } catch {}
  }, [movie]);

  const openTrailer = useCallback(key => {
    const url = `https://www.youtube.com/watch?v=${key}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open the trailer.');
    });
  }, []);

  const goToMovie = useCallback(
    item => {
      navigation.push(ROUTES.MOVIE_DETAILS, {movieId: item.id, movie: item});
    },
    [navigation],
  );

  const goToPerson = useCallback(
    person => {
      navigation.navigate(ROUTES.PERSON_DETAILS, {personId: person.id, person});
    },
    [navigation],
  );

  if (loading && !movie) {
    return (
      <View style={styles.root}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <DetailsSkeleton />
      </View>
    );
  }

  if (error && !movie) {
    return (
      <View style={styles.root}>
        <ErrorState message={error} onRetry={load} />
      </View>
    );
  }

  if (!movie) {
    return null;
  }

  const backdropUrl = buildBackdropUrl(movie.backdrop_path);
  const posterUrl = buildPosterUrl(movie.poster_path);
  const cast = (credits?.cast || []).slice(0, 15);
  const ratingColor = getRatingColor(movie.vote_average);
  const genres = movie.genres || [];

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
        accessibilityRole="button">
        <Icon name="chevron-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Share button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        accessibilityLabel="Share this movie"
        accessibilityRole="button">
        <Icon name="share-outline" size={22} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Backdrop */}
        <View style={styles.backdropContainer}>
          {backdropUrl ? (
            <FastImage
              source={{uri: backdropUrl, priority: FastImage.priority.high}}
              style={styles.backdrop}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <View style={[styles.backdrop, styles.backdropPlaceholder]} />
          )}
          <LinearGradient
            colors={['transparent', Colors.background]}
            locations={[0.4, 1]}
            style={styles.backdropGradient}
          />
        </View>

        {/* Poster + Info Row */}
        <View style={styles.heroRow}>
          <View style={styles.posterContainer}>
            {posterUrl ? (
              <FastImage
                source={{uri: posterUrl, priority: FastImage.priority.high}}
                style={styles.poster}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={[styles.poster, styles.posterPlaceholder]}>
                <Icon name="film-outline" size={32} color={Colors.textMuted} />
              </View>
            )}
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            {movie.original_title && movie.original_title !== movie.title ? (
              <Text style={styles.originalTitle}>{movie.original_title}</Text>
            ) : null}
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color={Colors.accentGold} />
              <Text style={[styles.rating, {color: ratingColor}]}>
                {formatRating(movie.vote_average)}
              </Text>
              <Text style={styles.voteCount}>
                ({formatVoteCount(movie.vote_count)})
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Icon
                name="calendar-outline"
                size={13}
                color={Colors.textMuted}
              />
              <Text style={styles.metaText}>
                {formatDate(movie.release_date)}
              </Text>
            </View>
            {movie.runtime ? (
              <View style={styles.metaRow}>
                <Icon name="time-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>
                  {formatRuntime(movie.runtime)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, favorited && styles.actionBtnActive]}
            onPress={toggleFavorite}
            accessibilityLabel={
              favorited ? 'Remove from favorites' : 'Add to favorites'
            }
            accessibilityRole="button">
            <Icon
              name={favorited ? 'heart' : 'heart-outline'}
              size={20}
              color={favorited ? '#fff' : Colors.textPrimary}
            />
            <Text
              style={[
                styles.actionBtnLabel,
                favorited && styles.actionBtnLabelActive,
              ]}>
              {favorited ? 'Favorited' : 'Favorite'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, inWatchlist && styles.watchlistActive]}
            onPress={toggleWatchlist}
            accessibilityLabel={
              inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'
            }
            accessibilityRole="button">
            <Icon
              name={inWatchlist ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={inWatchlist ? Colors.accentGold : Colors.textPrimary}
            />
            <Text
              style={[
                styles.actionBtnLabel,
                inWatchlist && {color: Colors.accentGold},
              ]}>
              {inWatchlist ? 'In Watchlist' : 'Watchlist'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Genres */}
        {genres.length > 0 && (
          <View style={styles.genreRow}>
            {genres.map(g => (
              <View key={g.id} style={styles.genreChip}>
                <Text style={styles.genreLabel}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Overview */}
        {movie.overview ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        ) : null}

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsGrid}>
            {movie.status ? (
              <DetailItem label="Status" value={movie.status} />
            ) : null}
            {movie.budget ? (
              <DetailItem label="Budget" value={formatCurrency(movie.budget)} />
            ) : null}
            {movie.revenue ? (
              <DetailItem
                label="Revenue"
                value={formatCurrency(movie.revenue)}
              />
            ) : null}
            {movie.production_companies?.[0] ? (
              <DetailItem
                label="Studio"
                value={movie.production_companies[0].name}
              />
            ) : null}
            {movie.spoken_languages?.[0] ? (
              <DetailItem
                label="Language"
                value={movie.spoken_languages[0].english_name}
              />
            ) : null}
          </View>
        </View>

        {/* Cast */}
        {cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <FlatList
              data={cast}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => `cast_${item.id}`}
              contentContainerStyle={styles.castRail}
              renderItem={({item}) => (
                <PersonCard
                  person={item}
                  role={item.character}
                  onPress={goToPerson}
                />
              )}
            />
          </View>
        )}

        {/* Trailers */}
        {videos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trailers & Videos</Text>
            <FlatList
              data={videos}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={v => v.id}
              contentContainerStyle={styles.videoRail}
              renderItem={({item: video}) => {
                const thumb = buildYouTubeThumbnail(video.key);
                return (
                  <TouchableOpacity
                    style={styles.videoCard}
                    onPress={() => openTrailer(video.key)}
                    accessibilityLabel={`Play trailer: ${video.name}`}
                    accessibilityRole="button">
                    {thumb && (
                      <FastImage
                        source={{uri: thumb}}
                        style={styles.videoThumb}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    )}
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.8)']}
                      style={styles.videoOverlay}>
                      <View style={styles.playButton}>
                        <Icon name="play" size={18} color="#fff" />
                      </View>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {video.name}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar Movies</Text>
            <FlatList
              data={similar}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => `similar_${item.id}`}
              contentContainerStyle={styles.movieRail}
              renderItem={({item}) => (
                <MovieCard item={item} onPress={goToMovie} />
              )}
            />
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <FlatList
              data={recommendations}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => `rec_${item.id}`}
              contentContainerStyle={styles.movieRail}
              renderItem={({item}) => (
                <MovieCard item={item} onPress={goToMovie} />
              )}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function DetailItem({label, value}) {
  return (
    <View style={detailStyles.item}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  item: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.divider,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.background},
  scroll: {flex: 1},
  content: {paddingBottom: 40},
  backButton: {
    position: 'absolute',
    top: 50,
    left: Spacing.base,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    position: 'absolute',
    top: 50,
    right: Spacing.base,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdropContainer: {height: BACKDROP_HEIGHT, position: 'relative'},
  backdrop: {width: '100%', height: '100%'},
  backdropPlaceholder: {backgroundColor: Colors.surfaceElevated},
  backdropGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  heroRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    marginTop: -60,
    gap: Spacing.md,
  },
  posterContainer: {
    width: 110,
    height: 165,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
    elevation: 8,
  },
  poster: {width: '100%', height: '100%'},
  posterPlaceholder: {
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInfo: {flex: 1, paddingTop: 65, gap: 6},
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  originalTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  ratingRow: {flexDirection: 'row', alignItems: 'center', gap: 5},
  rating: {fontSize: 18, fontWeight: '800'},
  voteCount: {fontSize: 12, color: Colors.textMuted},
  metaRow: {flexDirection: 'row', alignItems: 'center', gap: 5},
  metaText: {color: Colors.textSecondary, fontSize: 13},
  actions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  actionBtnActive: {backgroundColor: Colors.accent, borderColor: Colors.accent},
  watchlistActive: {borderColor: Colors.accentGold},
  actionBtnLabel: {color: Colors.textPrimary, fontSize: 13, fontWeight: '600'},
  actionBtnLabelActive: {color: '#fff'},
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.screenPadding,
    gap: 8,
    marginTop: Spacing.md,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.chip,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  genreLabel: {color: Colors.textSecondary, fontSize: 12, fontWeight: '500'},
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.screenPadding,
  },
  lastSection: {marginBottom: Spacing.base},
  sectionTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  overview: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  detailsGrid: {gap: 0},
  castRail: {paddingLeft: 0, gap: 12},
  videoRail: {paddingLeft: 0, gap: 12},
  movieRail: {paddingLeft: 0},
  videoCard: {
    width: 220,
    height: 130,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
  },
  videoThumb: {width: '100%', height: '100%'},
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 10,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  videoTitle: {color: '#fff', fontSize: 11, fontWeight: '600', lineHeight: 15},
});
