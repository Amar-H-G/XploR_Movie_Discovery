// CineVerse — Settings Screen
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius} from '../../theme';
import {
  getFavorites,
  getWatchlist,
  clearFavorites,
  clearWatchlist,
  clearAllStorage,
} from '../../storage/storageService';
import {getTrendingMovies} from '../../api/tmdbService';

export default function SettingsScreen() {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [apiTesting, setApiTesting] = useState(false);
  const [apiStatus, setApiStatus] = useState(null); // 'success' | 'error' | null
  const [apiMessage, setApiMessage] = useState('');

  const loadStats = useCallback(async () => {
    try {
      const favs = await getFavorites();
      const watch = await getWatchlist();
      setFavoriteCount(favs.length);
      setWatchlistCount(watch.length);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleTestApi = async () => {
    setApiTesting(true);
    setApiStatus(null);
    setApiMessage('Connecting to TMDB API v3...');
    try {
      const response = await getTrendingMovies();
      if (response && response.data && response.data.results) {
        setApiStatus('success');
        setApiMessage(
          `Success! TMDB connected. Retrieved ${response.data.results.length} trending items.`,
        );
      } else {
        setApiStatus('error');
        setApiMessage('Unexpected response structure received from TMDB.');
      }
    } catch (err) {
      setApiStatus('error');
      setApiMessage(err.message || 'Failed to connect to TMDB API.');
    } finally {
      setApiTesting(false);
    }
  };

  const confirmClearFavorites = () => {
    Alert.alert(
      'Clear Favorites',
      'Are you sure you want to remove all saved movies and TV shows from your favorites?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearFavorites();
            loadStats();
            Alert.alert('Cleared', 'Your favorites have been reset.');
          },
        },
      ],
    );
  };

  const confirmClearWatchlist = () => {
    Alert.alert(
      'Clear Watchlist',
      'Are you sure you want to remove all items from your watchlist?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearWatchlist();
            loadStats();
            Alert.alert('Cleared', 'Your watchlist has been reset.');
          },
        },
      ],
    );
  };

  const confirmResetAll = () => {
    Alert.alert(
      'Reset All Local Data',
      'This will erase all favorites, watchlist items, and onboarding preferences.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllStorage();
            loadStats();
            Alert.alert('Reset Complete', 'All local storage has been wiped.');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Preferences & System Information</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Section: TMDB API Connectivity */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>TMDB API CONNECTIVITY</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Icon name="server-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>TMDB API v3 Service</Text>
                <Text style={styles.rowSubtitle}>
                  api.themoviedb.org / 28 Endpoints
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestApi}
              disabled={apiTesting}
              activeOpacity={0.8}>
              {apiTesting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Icon
                    name="pulse-outline"
                    size={16}
                    color="#FFFFFF"
                    style={{marginRight: 6}}
                  />
                  <Text style={styles.testButtonText}>Test Connection</Text>
                </>
              )}
            </TouchableOpacity>

            {apiStatus && (
              <View
                style={[
                  styles.statusBox,
                  apiStatus === 'success'
                    ? styles.statusSuccess
                    : styles.statusError,
                ]}>
                <Icon
                  name={
                    apiStatus === 'success'
                      ? 'checkmark-circle-outline'
                      : 'alert-circle-outline'
                  }
                  size={18}
                  color={
                    apiStatus === 'success' ? Colors.success : Colors.error
                  }
                  style={{marginRight: 6}}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        apiStatus === 'success' ? Colors.success : Colors.error,
                    },
                  ]}>
                  {apiMessage}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Section: Storage & Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DATA & STORAGE</Text>

          <View style={styles.card}>
            {/* Favorites item */}
            <View style={styles.dataRow}>
              <View style={styles.rowLeft}>
                <Icon name="heart-outline" size={20} color={Colors.accentRed} />
                <View style={{marginLeft: 12}}>
                  <Text style={styles.rowTitle}>Saved Favorites</Text>
                  <Text style={styles.rowSubtitle}>
                    {favoriteCount} items in local store
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={confirmClearFavorites}
                style={styles.actionPill}>
                <Text style={styles.actionPillText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Watchlist item */}
            <View style={styles.dataRow}>
              <View style={styles.rowLeft}>
                <Icon
                  name="bookmark-outline"
                  size={20}
                  color={Colors.accentGold}
                />
                <View style={{marginLeft: 12}}>
                  <Text style={styles.rowTitle}>Watchlist Items</Text>
                  <Text style={styles.rowSubtitle}>
                    {watchlistCount} items queued
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={confirmClearWatchlist}
                style={styles.actionPill}>
                <Text style={styles.actionPillText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            {/* Reset All */}
            <TouchableOpacity
              style={styles.dangerRow}
              onPress={confirmResetAll}
              activeOpacity={0.7}>
              <Icon name="trash-outline" size={18} color={Colors.error} />
              <Text style={styles.dangerText}>Wipe All Local Storage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>APPEARANCE</Text>
          <View style={styles.card}>
            <View style={styles.dataRow}>
              <View style={styles.rowLeft}>
                <Icon name="moon-outline" size={20} color={Colors.accentCyan} />
                <View style={{marginLeft: 12}}>
                  <Text style={styles.rowTitle}>Theme</Text>
                  <Text style={styles.rowSubtitle}>
                    Midnight Cinematic (Dark First)
                  </Text>
                </View>
              </View>
              <View style={styles.activeTag}>
                <Text style={styles.activeTagText}>Default</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section: TMDB Attribution (Legal requirement) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>TMDB ATTRIBUTION</Text>
          <View style={styles.card}>
            <View style={styles.attributionBox}>
              <Icon
                name="film-outline"
                size={24}
                color={Colors.primary}
                style={{marginBottom: 8}}
              />
              <Text style={styles.attributionText}>
                This product uses the TMDB API but is not endorsed or certified
                by TMDB.
              </Text>
              <Text style={styles.attributionSubtext}>
                All movie and TV metadata, posters, backdrops, cast information,
                and ratings are provided by The Movie Database (TMDB).
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL('https://www.themoviedb.org')}
                style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Visit themoviedb.org</Text>
                <Icon
                  name="open-outline"
                  size={14}
                  color={Colors.primary}
                  style={{marginLeft: 4}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Section: About & Tech Specs */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ABOUT CINEVERSE</Text>
          <View style={styles.card}>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Application</Text>
              <Text style={styles.specValue}>CineVerse Discovery</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Version</Text>
              <Text style={styles.specValue}>1.0.0 (Build 1)</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Framework</Text>
              <Text style={styles.specValue}>React Native CLI 0.74.5</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Language</Text>
              <Text style={styles.specValue}>JavaScript (ES6+)</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Navigation</Text>
              <Text style={styles.specValue}>React Navigation v6/v7</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>HTTP Client</Text>
              <Text style={styles.specValue}>Axios + Interceptors</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Local Store</Text>
              <Text style={styles.specValue}>AsyncStorage</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Assignment</Text>
              <Text style={styles.specValue}>Xplor BizConnect Practical</Text>
            </View>
          </View>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 52,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textTertiary,
    letterSpacing: 1.2,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(229, 9, 20, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  rowSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  testButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.sm,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  statusSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderWidth: 1,
  },
  statusError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderWidth: 1,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionPillText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    marginTop: 4,
  },
  dangerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
    fontWeight: Typography.fontWeight.semiBold,
    marginLeft: 6,
  },
  activeTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  activeTagText: {
    color: Colors.success,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  attributionBox: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  attributionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  attributionSubtext: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  linkButtonText: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  specLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  specValue: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
});
