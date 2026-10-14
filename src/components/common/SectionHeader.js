// CineVerse — SectionHeader with "See All" action
import React, {memo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing} from '../../theme';

function SectionHeader({title, onSeeAll, subtitle}) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {onSeeAll ? (
        <TouchableOpacity
          style={styles.seeAll}
          onPress={onSeeAll}
          accessibilityLabel={`See all ${title}`}
          accessibilityRole="button">
          <Text style={styles.seeAllText}>See All</Text>
          <Icon name="chevron-forward" size={14} color={Colors.accent} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.sm,
  },
  left: {
    flex: 1,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: Spacing.sm,
  },
  seeAllText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default memo(SectionHeader);
