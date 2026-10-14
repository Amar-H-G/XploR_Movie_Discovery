// CineVerse — TV Details Screen
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Linking,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {
  getTVDetails,
  getTVCredits,
  getTVVideos,
  getTVSimilar,
  getTVRecommendations,
} from '../../api/tmdbService';
import {
  buildBackdropUrl,
  buildPosterUrl,
  buildYouTubeThumbnail,
} from '../../api/imageService';
import {
  formatDate,
  formatRating,
  formatVoteCount,
  getRatingColor,
} from '../../utils/helpers';
import TVCard from '../../components/tv/TVCard';
import PersonCard from '../../components/person/PersonCard';
import {DetailsSkeleton} from '../../components/skeletons/Skeletons';
import {ErrorState} from '../../components/states/StateComponents';
import useFavorites from '../../hooks/useFavorites';
import useWatchlist from '../../hooks/useWatchlist';
import {ROUTES} from '../../navigation/AppNavigator';

export default function TVDetailsScreen({route, navigation}) {
  const {seriesId} = route.params;
  const [show, setShow] = useState(route.params.show || null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showItem = show ? {...show, media_type: 'tv'} : null;
  const {favorited, toggleFavorite} = useFavorites(showItem);
  const {inWatchlist, toggleWatchlist} = useWatchlist(showItem);

  const load = useCallback(async () => {
    const controller = new AbortController();
    setError(null);
    setLoading(true);
    try {
      const [detailsRes, creditsRes, videosRes, simRes, recRes] =
        await Promise.all([
          getTVDetails(seriesId, controller.signal),
          getTVCredits(seriesId, controller.signal),
          getTVVideos(seriesId, controller.signal),
          getTVSimilar(seriesId, 1, controller.signal),
          getTVRecommendations(seriesId, 1, controller.signal),
        ]);

      setShow(detailsRes.data);
      setCredits(creditsRes.data);
      const ytVideos = (videosRes.data.results || []).filter(
        v =>
          v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
      );
      setVideos(ytVideos.slice(0, 5));
      setSimilar((simRes.data.results || []).slice(0, 10));
      setRecommendations((recRes.data.results || []).slice(0, 10));
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      setError(err.message || 'Failed to load show details');
    } finally {
      setLoading(false);
    }
  }, [seriesId]);

  useEffect(() => {
    load();
  }, [load]);

  const openTrailer = useCallback(key => {
    Linking.openURL(`https://www.youtube.com/watch?v=${key}`).catch(() =>
      Alert.alert('Error', 'Could not open the trailer.'),
    );
  }, []);

  const goToTV = useCallback(
    item => navigation.push(ROUTES.TV_DETAILS, {seriesId: item.id, show: item}),
    [navigation],
  );

  const goToPerson = useCallback(
    person =>
      navigation.navigate(ROUTES.PERSON_DETAILS, {personId: person.id, person}),
    [navigation],
  );

  if (loading && !show) {
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

  if (error && !show) {
    return (
      <View style={styles.root}>
        <ErrorState message={error} onRetry={load} />
      </View>
    );
  }

  if (!show) {
    return null;
  }

  const backdropUrl = buildBackdropUrl(show.backdrop_path);
  const posterUrl = buildPosterUrl(show.poster_path);
  const cast = (credits?.cast || []).slice(0, 15);
  const ratingColor = getRatingColor(show.vote_average);
  const genres = show.genres || [];

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Go back"
        accessibilityRole="button">
        <Icon name="chevron-back" size={24} color={Colors.textPrimary} />
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
          <View style={styles.tvBadgeOverlay}>
            <View style={styles.tvBadge}>
              <Text style={styles.tvBadgeText}>TV SERIES</Text>
            </View>
          </View>
        </View>

        {/* Hero Row */}
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
                <Icon name="tv-outline" size={32} color={Colors.textMuted} />
              </View>
            )}
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.title}>{show.name}</Text>
            {show.original_name && show.original_name !== show.name ? (
              <Text style={styles.originalTitle}>{show.original_name}</Text>
            ) : null}
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color={Colors.accentGold} />
              <Text style={[styles.rating, {color: ratingColor}]}>
                {formatRating(show.vote_average)}
              </Text>
              <Text style={styles.voteCount}>
                ({formatVoteCount(show.vote_count)})
              </Text>
            </View>
            {show.first_air_date ? (
              <View style={styles.metaRow}>
                <Icon
                  name="calendar-outline"
                  size={13}
                  color={Colors.textMuted}
                />
                <Text style={styles.metaText}>
                  {formatDate(show.first_air_date)}
                </Text>
              </View>
            ) : null}
            <View style={styles.metaRow}>
              <Icon name="layers-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.metaText}>
                {show.number_of_seasons || '?'} Season
                {show.number_of_seasons !== 1 ? 's' : ''} •{' '}
                {show.number_of_episodes || '?'} Episodes
              </Text>
            </View>
            {show.status ? (
              <View style={styles.metaRow}>
                <Icon name="radio-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.metaText}>{show.status}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, favorited && styles.actionBtnActive]}
            onPress={toggleFavorite}>
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
            onPress={toggleWatchlist}>
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
        {show.overview ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{show.overview}</Text>
          </View>
        ) : null}

        {/* Networks */}
        {show.networks?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Network</Text>
            <Text style={styles.networkName}>{show.networks[0].name}</Text>
          </View>
        )}

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
            <Text style={styles.sectionTitle}>Trailers</Text>
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
                    onPress={() => openTrailer(video.key)}>
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
            <Text style={styles.sectionTitle}>Similar Shows</Text>
            <FlatList
              data={similar}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => `sim_${item.id}`}
              contentContainerStyle={styles.movieRail}
              renderItem={({item}) => <TVCard item={item} onPress={goToTV} />}
            />
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>You Might Also Like</Text>
            <FlatList
              data={recommendations}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => `rec_${item.id}`}
              contentContainerStyle={styles.movieRail}
              renderItem={({item}) => <TVCard item={item} onPress={goToTV} />}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

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
  backdropContainer: {height: 240, position: 'relative'},
  backdrop: {width: '100%', height: '100%'},
  backdropPlaceholder: {backgroundColor: Colors.surfaceElevated},
  backdropGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  tvBadgeOverlay: {position: 'absolute', top: 60, right: Spacing.base},
  tvBadge: {
    backgroundColor: Colors.accentBlue,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tvBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
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
  originalTitle: {fontSize: 12, color: Colors.textMuted, fontStyle: 'italic'},
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
    borderColor: Colors.accentBlue + '55',
  },
  genreLabel: {color: Colors.accentBlue, fontSize: 12, fontWeight: '500'},
  section: {marginTop: Spacing.xl, paddingHorizontal: Spacing.screenPadding},
  lastSection: {marginBottom: Spacing.base},
  sectionTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  overview: {...Typography.body, color: Colors.textSecondary, lineHeight: 24},
  networkName: {color: Colors.textPrimary, fontSize: 16, fontWeight: '600'},
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
    backgroundColor: Colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  videoTitle: {color: '#fff', fontSize: 11, fontWeight: '600', lineHeight: 15},
});
