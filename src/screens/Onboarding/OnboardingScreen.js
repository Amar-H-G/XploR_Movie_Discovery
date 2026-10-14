// CineVerse — Onboarding Screen
import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius} from '../../theme';
import {setOnboardingDone} from '../../storage/storageService';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: 'flame',
    color: '#E50914',
    title: 'Discover Cinema',
    subtitle:
      'Explore real-time trending movies, top-rated series, and box office hits powered directly by the TMDB API v3 catalog.',
  },
  {
    id: '2',
    icon: 'videocam',
    color: '#06B6D4',
    title: 'Watch Trailers & Cast',
    subtitle:
      'Delve into high-definition backdrops, official YouTube trailers, cast filmographies, and comprehensive production credits.',
  },
  {
    id: '3',
    icon: 'bookmark',
    color: '#F59E0B',
    title: 'Personal Watchlist',
    subtitle:
      'Save your favorites and maintain a personal watchlist offline with instant AsyncStorage synchronization.',
  },
];

export default function OnboardingScreen({navigation}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleFinish = async () => {
    await setOnboardingDone();
    navigation.replace('Main');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const renderSlide = ({item}) => (
    <View style={styles.slide}>
      <View style={[styles.iconCircle, {backgroundColor: `${item.color}20`}]}>
        <Icon name={item.icon} size={64} color={item.color} />
      </View>

      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Top Bar with Skip */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Icon name="film" size={20} color={Colors.primary} />
          <Text style={styles.topLogoText}>CINEVERSE</Text>
        </View>

        <TouchableOpacity
          onPress={handleFinish}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slide Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
      />

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Icon
            name={
              currentIndex === SLIDES.length - 1
                ? 'arrow-forward-circle'
                : 'chevron-forward'
            }
            size={20}
            color="#FFFFFF"
            style={{marginLeft: 6}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl + 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topLogoText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginLeft: 8,
  },
  skipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  slideTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  slideSubtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomControls: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.border,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: BorderRadius.full,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
});
