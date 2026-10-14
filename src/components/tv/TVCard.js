// CineVerse — TVCard component (similar to MovieCard but for TV shows)
import React, {memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, BorderRadius, Typography, Spacing} from '../../theme';
import {buildPosterUrl} from '../../api/imageService';
import {formatRating, getTitle} from '../../utils/helpers';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH =
  (SCREEN_WIDTH - Spacing.screenPadding * 2 - Spacing.cardGap) / 2.4;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

function TVCard({item, onPress, style}) {
  if (!item) {
    return null;
  }
  const title = getTitle(item);
  const rating = formatRating(item.vote_average);
  const posterUrl = buildPosterUrl(item.poster_path);
  const year = item.first_air_date ? item.first_air_date.substring(0, 4) : '';

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress && onPress(item)}
      activeOpacity={0.75}
      accessibilityLabel={`${title}, rated ${rating}`}
      accessibilityRole="button">
      <View style={styles.imageContainer}>
        {posterUrl ? (
          <FastImage
            source={{uri: posterUrl, priority: FastImage.priority.normal}}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Icon name="tv-outline" size={36} color={Colors.textMuted} />
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Icon name="star" size={10} color={Colors.accentGold} />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
        <View style={styles.tvLabel}>
          <Text style={styles.tvLabelText}>TV</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {year ? <Text style={styles.year}>{year}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: Spacing.cardGap,
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius.card,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceElevated,
  },
  image: {width: '100%', height: '100%'},
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {color: Colors.accentGold, fontSize: 10, fontWeight: '700'},
  tvLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.accentBlue,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  tvLabelText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  info: {paddingTop: 6, paddingHorizontal: 2},
  title: {...Typography.cardTitle, color: Colors.textPrimary, lineHeight: 18},
  year: {...Typography.caption, color: Colors.textMuted, marginTop: 2},
});

export default memo(TVCard);
export {CARD_WIDTH, CARD_HEIGHT};
