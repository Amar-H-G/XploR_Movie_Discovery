// CineVerse — HeroCard — large featured movie banner
import React, {memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, BorderRadius, Typography, Spacing} from '../../theme';
import {buildBackdropUrl} from '../../api/imageService';
import {
  formatRating,
  getTitle,
  getReleaseDate,
  getYear,
} from '../../utils/helpers';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HERO_HEIGHT = 220;

function HeroCard({item, onPress}) {
  if (!item) {
    return null;
  }
  const title = getTitle(item);
  const year = getYear(getReleaseDate(item));
  const rating = formatRating(item.vote_average);
  const backdropUrl = buildBackdropUrl(item.backdrop_path);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.9}
      accessibilityLabel={`Featured: ${title}`}
      accessibilityRole="button">
      <View style={styles.imageContainer}>
        {backdropUrl ? (
          <ImageBackground
            source={{uri: backdropUrl}}
            style={styles.backdrop}
            resizeMode="cover">
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)', Colors.background]}
              locations={[0.2, 0.65, 1]}
              style={styles.gradient}>
              <View style={styles.content}>
                <View style={styles.badges}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>FEATURED</Text>
                  </View>
                  {item.media_type === 'tv' && (
                    <View style={[styles.badge, styles.tvBadge]}>
                      <Text style={styles.badgeText}>TV</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.title} numberOfLines={2}>
                  {title}
                </Text>
                <View style={styles.meta}>
                  <Icon name="star" size={14} color={Colors.accentGold} />
                  <Text style={styles.rating}>{rating}</Text>
                  {year ? <Text style={styles.year}> • {year}</Text> : null}
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        ) : (
          <View style={[styles.backdrop, styles.placeholderBackdrop]}>
            <Icon name="film-outline" size={60} color={Colors.textMuted} />
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - Spacing.screenPadding * 2,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginRight: Spacing.base,
  },
  imageContainer: {
    height: HERO_HEIGHT,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  backdrop: {
    flex: 1,
  },
  placeholderBackdrop: {
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.base,
  },
  content: {
    gap: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tvBadge: {
    backgroundColor: Colors.accentBlue,
  },
  badgeText: {
    color: Colors.textPrimary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    lineHeight: 26,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: Colors.accentGold,
    fontSize: 13,
    fontWeight: '700',
  },
  year: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
});

export default memo(HeroCard);
