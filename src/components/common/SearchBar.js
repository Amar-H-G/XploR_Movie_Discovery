// CineVerse — SearchBar component
import React, {memo, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, BorderRadius, Spacing, Typography} from '../../theme';

function SearchBar({
  value,
  onChangeText,
  onClear,
  onSubmit,
  placeholder = 'Search movies, shows, people…',
  autoFocus = false,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    Animated.spring(scale, {
      toValue: 1.02,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, {transform: [{scale}]}]}>
      <View style={styles.container}>
        <Icon
          name="search-outline"
          size={18}
          color={Colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          returnKeyType="search"
          autoFocus={autoFocus}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
          accessibilityLabel="Search input"
          accessibilityRole="search"
        />
        {value ? (
          <TouchableOpacity
            onPress={onClear}
            style={styles.clearButton}
            accessibilityLabel="Clear search"
            accessibilityRole="button">
            <Icon name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.screenPadding,
    marginVertical: Spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 46,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: Spacing.xs,
  },
});

export default memo(SearchBar);
