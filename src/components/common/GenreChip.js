// CineVerse — GenreChip component
import React, {memo} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors, BorderRadius} from '../../theme';

function GenreChip({genre, onPress, selected}) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.selected]}
      onPress={() => onPress && onPress(genre)}
      activeOpacity={0.7}
      accessibilityLabel={genre.name}
      accessibilityRole="button"
      accessibilityState={{selected}}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {genre.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.chip,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
    marginRight: 8,
    marginBottom: 8,
  },
  selected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  selectedLabel: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});

export default memo(GenreChip);
