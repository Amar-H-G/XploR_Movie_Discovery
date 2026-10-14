// CineVerse — Empty and Error state components
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius} from '../../theme';

// Generic empty state
export function EmptyState({
  icon = 'search-outline',
  title,
  message,
  action,
  actionLabel,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={56} color={Colors.textMuted} />
      </View>
      <Text style={styles.title}>{title || 'Nothing here yet'}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action && actionLabel ? (
        <TouchableOpacity style={styles.actionButton} onPress={action}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// Error state with retry
export function ErrorState({message, onRetry}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="cloud-offline-outline" size={56} color={Colors.error} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>
        {message || 'Unable to load content. Please try again.'}
      </Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Icon name="refresh-outline" size={18} color={Colors.textPrimary} />
          <Text style={styles.retryLabel}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

// No favorites / watchlist state
export function NoItemsState({type = 'favorites'}) {
  const isFav = type === 'favorites';
  return (
    <EmptyState
      icon={isFav ? 'heart-outline' : 'bookmark-outline'}
      title={isFav ? 'No favorites yet' : 'Watchlist is empty'}
      message={
        isFav
          ? 'Tap the heart icon on any movie or show to add it here.'
          : 'Tap the bookmark icon on any movie or show to add it here.'
      }
    />
  );
}

// No search results
export function NoResultsState({query}) {
  return (
    <EmptyState
      icon="search-outline"
      title="No results found"
      message={
        query
          ? `We couldn't find anything for "${query}".`
          : 'Try a different search term.'
      }
    />
  );
}

// Network error
export function NetworkErrorState({onRetry}) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="wifi-outline" size={56} color={Colors.warning} />
      </View>
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>
        Please check your network settings and try again.
      </Text>
      {onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Icon name="refresh-outline" size={18} color={Colors.textPrimary} />
          <Text style={styles.retryLabel}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
    gap: Spacing.md,
  },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.button,
  },
  actionLabel: {
    ...Typography.button,
    color: Colors.textPrimary,
  },
  retryButton: {
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.button,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  retryLabel: {
    ...Typography.button,
    color: Colors.textPrimary,
    fontSize: 14,
  },
});
