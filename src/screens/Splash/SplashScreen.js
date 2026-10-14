// CineVerse — Splash Screen
import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing} from '../../theme';
import {getOnboardingDone} from '../../storage/storageService';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

export default function SplashScreen({navigation}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start intro animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Check onboarding status and navigate
    const timer = setTimeout(async () => {
      try {
        const isDone = await getOnboardingDone();
        if (isDone) {
          navigation.replace('Main');
        } else {
          navigation.replace('Onboarding');
        }
      } catch {
        navigation.replace('Main');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, pulseAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* Background glow circle */}
      <Animated.View
        style={[
          styles.glowCircle,
          {
            transform: [{scale: pulseAnim}],
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.4],
            }),
          },
        ]}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {/* Cinematic Film Reel / Play Logo */}
        <View style={styles.logoBadge}>
          <Icon name="film" size={44} color="#FFFFFF" />
          <View style={styles.playOverlay}>
            <Icon name="play" size={18} color={Colors.primary} />
          </View>
        </View>

        {/* Brand Name */}
        <Text style={styles.brandTitle}>
          CINE<Text style={styles.brandTitleAccent}>VERSE</Text>
        </Text>

        {/* Tagline */}
        <Text style={styles.tagline}>DISCOVER • TRACK • EXPERIENCE</Text>
      </Animated.View>

      {/* Footer Powered By */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>POWERED BY TMDB</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderRadius: (SCREEN_WIDTH * 0.7) / 2,
    backgroundColor: Colors.primary,
  },
  content: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
  },
  playOverlay: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  brandTitleAccent: {
    color: Colors.primary,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 2.5,
    marginTop: Spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 36,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
});
