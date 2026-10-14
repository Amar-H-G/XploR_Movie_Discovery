// CineVerse — Person Details Screen
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {
  getPersonDetails,
  getPersonCombinedCredits,
} from '../../api/tmdbService';
import {buildProfileUrl, buildPosterUrl} from '../../api/imageService';
import {
  formatDate,
  getTitle,
  getYear,
  getReleaseDate,
} from '../../utils/helpers';
import {DetailsSkeleton} from '../../components/skeletons/Skeletons';
import {ErrorState} from '../../components/states/StateComponents';
import {ROUTES} from '../../navigation/AppNavigator';

export default function PersonDetailsScreen({route, navigation}) {
  const {personId} = route.params;
  const [person, setPerson] = useState(route.params.person || null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const load = useCallback(async () => {
    const controller = new AbortController();
    setError(null);
    setLoading(true);
    try {
      const [detailsRes, creditsRes] = await Promise.all([
        getPersonDetails(personId, controller.signal),
        getPersonCombinedCredits(personId, controller.signal),
      ]);
      setPerson(detailsRes.data);
      setCredits(creditsRes.data);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreditPress = useCallback(
    item => {
      if (item.media_type === 'tv') {
        navigation.navigate(ROUTES.TV_DETAILS, {seriesId: item.id, show: item});
      } else {
        navigation.navigate(ROUTES.MOVIE_DETAILS, {
          movieId: item.id,
          movie: item,
        });
      }
    },
    [navigation],
  );

  if (loading && !person) {
    return (
      <View style={styles.root}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.background}
        />
        <DetailsSkeleton />
      </View>
    );
  }

  if (error && !person) {
    return (
      <View style={styles.root}>
        <ErrorState message={error} onRetry={load} />
      </View>
    );
  }

  if (!person) {
    return null;
  }

  const profileUrl = buildProfileUrl(person.profile_path, 'h632');
  const bio = person.biography || '';
  const shortBio = bio.length > 300 ? bio.substring(0, 300) + '…' : bio;
  const knownFor = (credits?.cast || [])
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 15);

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
        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profileUrl ? (
              <FastImage
                source={{uri: profileUrl, priority: FastImage.priority.high}}
                style={styles.avatar}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Icon
                  name="person-outline"
                  size={60}
                  color={Colors.textMuted}
                />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{person.name}</Text>
            {person.known_for_department ? (
              <Text style={styles.dept}>{person.known_for_department}</Text>
            ) : null}
            {person.birthday ? (
              <View style={styles.metaRow}>
                <Icon
                  name="calendar-outline"
                  size={13}
                  color={Colors.textMuted}
                />
                <Text style={styles.metaText}>
                  {formatDate(person.birthday)}
                </Text>
              </View>
            ) : null}
            {person.place_of_birth ? (
              <View style={styles.metaRow}>
                <Icon
                  name="location-outline"
                  size={13}
                  color={Colors.textMuted}
                />
                <Text style={styles.metaText} numberOfLines={2}>
                  {person.place_of_birth}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Biography */}
        {bio.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biography</Text>
            <Text style={styles.bio}>{expanded ? bio : shortBio}</Text>
            {bio.length > 300 && (
              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={styles.readMore}>
                  {expanded ? 'Read Less' : 'Read More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Known For */}
        {knownFor.length > 0 && (
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Known For</Text>
            <FlatList
              data={knownFor}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, idx) => `credit_${item.id}_${idx}`}
              contentContainerStyle={styles.creditsRail}
              renderItem={({item}) => {
                const title = getTitle(item);
                const year = getYear(getReleaseDate(item));
                const posterUrl = buildPosterUrl(item.poster_path);
                return (
                  <TouchableOpacity
                    style={styles.creditCard}
                    onPress={() => handleCreditPress(item)}>
                    {posterUrl ? (
                      <FastImage
                        source={{uri: posterUrl}}
                        style={styles.creditPoster}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : (
                      <View
                        style={[styles.creditPoster, styles.posterPlaceholder]}>
                        <Icon
                          name="film-outline"
                          size={24}
                          color={Colors.textMuted}
                        />
                      </View>
                    )}
                    <Text style={styles.creditTitle} numberOfLines={2}>
                      {title}
                    </Text>
                    {year ? (
                      <Text style={styles.creditYear}>{year}</Text>
                    ) : null}
                  </TouchableOpacity>
                );
              }}
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
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    padding: Spacing.screenPadding,
    paddingTop: 90,
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 120,
    height: 180,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
    elevation: 8,
  },
  avatar: {width: '100%', height: '100%'},
  avatarPlaceholder: {
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {flex: 1, gap: 8, paddingTop: 8},
  name: {...Typography.sectionTitle, color: Colors.textPrimary, fontSize: 22},
  dept: {color: Colors.accent, fontSize: 14, fontWeight: '600'},
  metaRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 5},
  metaText: {color: Colors.textSecondary, fontSize: 13, flex: 1},
  section: {paddingHorizontal: Spacing.screenPadding, marginTop: Spacing.xl},
  lastSection: {marginBottom: Spacing.base},
  sectionTitle: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  bio: {color: Colors.textSecondary, fontSize: 14, lineHeight: 22},
  readMore: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  creditsRail: {gap: 12, paddingLeft: 0},
  creditCard: {width: 100, gap: 5},
  creditPoster: {
    width: 100,
    height: 150,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  posterPlaceholder: {
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditTitle: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  creditYear: {color: Colors.textMuted, fontSize: 10},
});
