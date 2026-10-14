// CineVerse — RatingBadge component
import React, {memo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, BorderRadius} from '../../theme';
import {formatRating, getRatingColor} from '../../utils/helpers';

function RatingBadge({rating, size = 'md', showIcon = true}) {
  const value = parseFloat(rating) || 0;
  const color = getRatingColor(value);
  const formatted = formatRating(value);

  const iconSize = size === 'sm' ? 10 : size === 'lg' ? 18 : 14;
  const fontSize = size === 'sm' ? 10 : size === 'lg' ? 16 : 13;

  return (
    <View style={[styles.container, {borderColor: color}]}>
      {showIcon && (
        <Icon name="star" size={iconSize} color={Colors.accentGold} />
      )}
      <Text style={[styles.text, {color, fontSize}]}>{formatted}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  text: {
    fontWeight: '700',
  },
});

export default memo(RatingBadge);
