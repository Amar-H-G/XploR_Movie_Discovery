// CineVerse — App Navigation (React Navigation)
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography} from '../theme';

// Screens
import SplashScreen from '../screens/Splash/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import WatchlistScreen from '../screens/Watchlist/WatchlistScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import MovieDetailsScreen from '../screens/MovieDetails/MovieDetailsScreen';
import TVDetailsScreen from '../screens/TVDetails/TVDetailsScreen';
import GenresScreen from '../screens/Genres/GenresScreen';
import GenreListScreen from '../screens/Genres/GenreListScreen';
import PersonDetailsScreen from '../screens/PersonDetails/PersonDetailsScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

// ─── Route names ─────────────────────────────────────────────────────────────

export const ROUTES = {
  // Root
  SPLASH: 'Splash',
  ONBOARDING: 'Onboarding',
  MAIN: 'Main',

  // Tabs
  HOME_TAB: 'HomeTab',
  SEARCH_TAB: 'SearchTab',
  FAVORITES_TAB: 'FavoritesTab',
  WATCHLIST_TAB: 'WatchlistTab',
  SETTINGS_TAB: 'SettingsTab',

  // Stacks
  HOME: 'Home',
  SEARCH: 'Search',
  FAVORITES: 'Favorites',
  WATCHLIST: 'Watchlist',
  SETTINGS: 'Settings',
  MOVIE_DETAILS: 'MovieDetails',
  TV_DETAILS: 'TVDetails',
  GENRES: 'Genres',
  GENRE_LIST: 'GenreList',
  PERSON_DETAILS: 'PersonDetails',
};

// ─── Tab Icon Map ────────────────────────────────────────────────────────────

const TAB_ICONS = {
  [ROUTES.HOME_TAB]: {focused: 'home', unfocused: 'home-outline'},
  [ROUTES.SEARCH_TAB]: {focused: 'search', unfocused: 'search-outline'},
  [ROUTES.FAVORITES_TAB]: {focused: 'heart', unfocused: 'heart-outline'},
  [ROUTES.WATCHLIST_TAB]: {focused: 'bookmark', unfocused: 'bookmark-outline'},
  [ROUTES.SETTINGS_TAB]: {focused: 'settings', unfocused: 'settings-outline'},
};

// ─── Stack screen options ───────────────────────────────────────────────────

const stackOptions = {
  headerShown: false,
  contentStyle: {backgroundColor: Colors.background},
  animation: 'slide_from_right',
};

// ─── Shared Screens ─────────────────────────────────────────────────────────

const renderSharedScreens = Stack => (
  <>
    <Stack.Screen name={ROUTES.MOVIE_DETAILS} component={MovieDetailsScreen} />
    <Stack.Screen name={ROUTES.TV_DETAILS} component={TVDetailsScreen} />
    <Stack.Screen
      name={ROUTES.PERSON_DETAILS}
      component={PersonDetailsScreen}
    />
    <Stack.Screen name={ROUTES.GENRES} component={GenresScreen} />
    <Stack.Screen name={ROUTES.GENRE_LIST} component={GenreListScreen} />
  </>
);

function HomeStack() {
  const S = createNativeStackNavigator();
  return (
    <S.Navigator screenOptions={stackOptions}>
      <S.Screen name={ROUTES.HOME} component={HomeScreen} />
      {renderSharedScreens(S)}
    </S.Navigator>
  );
}

function SearchStack() {
  const S = createNativeStackNavigator();
  return (
    <S.Navigator screenOptions={stackOptions}>
      <S.Screen name={ROUTES.SEARCH} component={SearchScreen} />
      {renderSharedScreens(S)}
    </S.Navigator>
  );
}

function FavoritesStack() {
  const S = createNativeStackNavigator();
  return (
    <S.Navigator screenOptions={stackOptions}>
      <S.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} />
      {renderSharedScreens(S)}
    </S.Navigator>
  );
}

function WatchlistStack() {
  const S = createNativeStackNavigator();
  return (
    <S.Navigator screenOptions={stackOptions}>
      <S.Screen name={ROUTES.WATCHLIST} component={WatchlistScreen} />
      {renderSharedScreens(S)}
    </S.Navigator>
  );
}

function SettingsStack() {
  const S = createNativeStackNavigator();
  return (
    <S.Navigator screenOptions={stackOptions}>
      <S.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
    </S.Navigator>
  );
}

// ─── Main Tab Navigator ──────────────────────────────────────────────────────

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBackground,
          borderTopColor: Colors.border,
          borderTopWidth: 0.5,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: Colors.tabBarActive,
        tabBarInactiveTintColor: Colors.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
        tabBarIcon: ({focused, color, size}) => {
          const icons = TAB_ICONS[route.name];
          const iconName = icons
            ? focused
              ? icons.focused
              : icons.unfocused
            : 'ellipse-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeStack}
        options={{title: 'Home'}}
      />
      <Tab.Screen
        name={ROUTES.SEARCH_TAB}
        component={SearchStack}
        options={{title: 'Search'}}
      />
      <Tab.Screen
        name={ROUTES.FAVORITES_TAB}
        component={FavoritesStack}
        options={{title: 'Favorites'}}
      />
      <Tab.Screen
        name={ROUTES.WATCHLIST_TAB}
        component={WatchlistStack}
        options={{title: 'Watchlist'}}
      />
      <Tab.Screen
        name={ROUTES.SETTINGS_TAB}
        component={SettingsStack}
        options={{title: 'Settings'}}
      />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ──────────────────────────────────────────────────────────

export default function AppNavigator() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      <RootStack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <RootStack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
      <RootStack.Screen name={ROUTES.MAIN} component={MainTabs} />
    </RootStack.Navigator>
  );
}
