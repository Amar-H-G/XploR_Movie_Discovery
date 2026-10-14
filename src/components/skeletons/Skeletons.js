// CineVerse — Skeleton loading components
import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';
import {Colors, BorderRadius, Spacing} from '../../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// Base animated shimmer effect
function ShimmerView({style}) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [shimmer]);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.skeletonBase, Colors.skeletonHighlight],
  });

  return <Animated.View style={[style, {backgroundColor}]} />;
}

// Movie card skeleton
export function MovieCardSkeleton({width = 130, height = 195}) {
  return (
    <View style={[styles.cardContainer, {width}]}>
      <ShimmerView
        style={[
          styles.cardImage,
          {width, height, borderRadius: BorderRadius.card},
        ]}
      />
      <ShimmerView style={styles.cardTitleLine} />
      <ShimmerView style={styles.cardSubtitleLine} />
    </View>
  );
}

// Movie rail skeleton (multiple cards)
export function MovieRailSkeleton({count = 4}) {
  return (
    <View style={styles.rail}>
      {Array.from({length: count}).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </View>
  );
}

// Hero card skeleton
export function HeroCardSkeleton() {
  return (
    <ShimmerView
      style={[
        styles.heroCard,
        {width: SCREEN_WIDTH - Spacing.screenPadding * 2, height: 220},
      ]}
    />
  );
}

// Details screen skeleton
export function DetailsSkeleton() {
  return (
    <View style={styles.detailsContainer}>
      <ShimmerView style={styles.detailsBackdrop} />
      <View style={styles.detailsContent}>
        <ShimmerView style={styles.detailsTitle} />
        <ShimmerView style={styles.detailsMeta} />
        <ShimmerView style={styles.detailsLine} />
        <ShimmerView style={styles.detailsLine} />
        <ShimmerView style={[styles.detailsLine, {width: '60%'}]} />
      </View>
    </View>
  );
}

// Search result skeleton
export function SearchResultSkeleton({count = 5}) {
  return (
    <View>
      {Array.from({length: count}).map((_, i) => (
        <View key={i} style={styles.searchRow}>
          <ShimmerView style={styles.searchThumb} />
          <View style={styles.searchInfo}>
            <ShimmerView style={styles.searchTitle} />
            <ShimmerView style={styles.searchSub} />
          </View>
        </View>
      ))}
    </View>
  );
}

// Cast row skeleton
export function CastSkeleton({count = 5}) {
  return (
    <View style={styles.rail}>
      {Array.from({length: count}).map((_, i) => (
        <View key={i} style={styles.castItem}>
          <ShimmerView style={styles.castAvatar} />
          <ShimmerView style={styles.castName} />
          <ShimmerView style={styles.castRole} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    gap: Spacing.cardGap,
  },
  cardContainer: {
    gap: 6,
  },
  cardImage: {
    backgroundColor: Colors.skeletonBase,
  },
  cardTitleLine: {
    height: 12,
    width: '90%',
    borderRadius: 4,
    backgroundColor: Colors.skeletonBase,
  },
  cardSubtitleLine: {
    height: 10,
    width: '50%',
    borderRadius: 4,
    backgroundColor: Colors.skeletonBase,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.screenPadding,
    backgroundColor: Colors.skeletonBase,
  },
  detailsContainer: {
    flex: 1,
  },
  detailsBackdrop: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.skeletonBase,
  },
  detailsContent: {
    padding: Spacing.base,
    gap: 12,
  },
  detailsTitle: {
    height: 28,
    width: '80%',
    borderRadius: 6,
    backgroundColor: Colors.skeletonBase,
  },
  detailsMeta: {
    height: 16,
    width: '60%',
    borderRadius: 4,
    backgroundColor: Colors.skeletonBase,
  },
  detailsLine: {
    height: 14,
    width: '100%',
    borderRadius: 4,
    backgroundColor: Colors.skeletonBase,
  },
  searchRow: {
    flexDirection: 'row',
    padding: Spacing.base,
    gap: Spacing.md,
    alignItems: 'center',
  },
  searchThumb: {
    width: 60,
    height: 90,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.skeletonBase,
  },
  searchInfo: {
    flex: 1,
    gap: 8,
  },
  searchTitle: {
    height: 16,
    width: '80%',
    borderRadius: 4,
    backgroundColor: Colors.skeletonBase,
  },
  searchSub: {
    height: 12,
    width: '50%',
    borderRadius: 4,
    backgroundColor: Colors.skeletonBase,
  },
  castItem: {
    alignItems: 'center',
    gap: 6,
    width: 70,
  },
  castAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.skeletonBase,
  },
  castName: {
    height: 10,
    width: 55,
    borderRadius: 4,
    backgroundColor: Colors.skeletonBase,
  },
  castRole: {
    height: 8,
    width: 45,
    borderRadius: 4,
    backgroundColor: Colors.skeletonBase,
  },
});
