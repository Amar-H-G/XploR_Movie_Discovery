// CineVerse — PersonCard component
import React, {memo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Spacing, Typography} from '../../theme';
import {buildProfileUrl} from '../../api/imageService';

const AVATAR_SIZE = 70;

function PersonCard({person, onPress, role}) {
  if (!person) {
    return null;
  }
  const profileUrl = buildProfileUrl(person.profile_path);
  const name = person.name || person.original_name || 'Unknown';
  const displayRole = role || person.character || person.job || '';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(person)}
      activeOpacity={0.75}
      accessibilityLabel={`${name}${displayRole ? `, ${displayRole}` : ''}`}
      accessibilityRole="button">
      <View style={styles.avatarContainer}>
        {profileUrl ? (
          <FastImage
            source={{uri: profileUrl, priority: FastImage.priority.normal}}
            style={styles.avatar}
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Icon name="person-outline" size={28} color={Colors.textMuted} />
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
      {displayRole ? (
        <Text style={styles.role} numberOfLines={1}>
          {displayRole}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: AVATAR_SIZE + 10,
    alignItems: 'center',
    marginRight: Spacing.md,
    gap: 5,
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...Typography.label,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 15,
  },
  role: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

export default memo(PersonCard);
