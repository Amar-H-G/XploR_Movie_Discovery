// CineVerse — App Navigation (React Navigation)
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../theme';

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

// ─── Module-level Navigator instances (Never re-create in render) ────────────

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeNav = createNativeStackNavigator();
const SearchNav = createNativeStackNavigator();
const FavoritesNav = createNativeStackNavigator();
const WatchlistNav = createNativeStackNavigator();
const SettingsNav = createNativeStackNavigator();

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

// ─── Individual Tab Stacks (Direct Screen children, NO fragments) ───────────

function HomeStack() {
  return (
    <HomeNav.Navigator screenOptions={stackOptions}>
      <HomeNav.Screen name={ROUTES.HOME} component={HomeScreen} />
      <HomeNav.Screen
        name={ROUTES.MOVIE_DETAILS}
        component={MovieDetailsScreen}
      />
      <HomeNav.Screen name={ROUTES.TV_DETAILS} component={TVDetailsScreen} />
      <HomeNav.Screen
        name={ROUTES.PERSON_DETAILS}
        component={PersonDetailsScreen}
      />
      <HomeNav.Screen name={ROUTES.GENRES} component={GenresScreen} />
      <HomeNav.Screen name={ROUTES.GENRE_LIST} component={GenreListScreen} />
    </HomeNav.Navigator>
  );
}

function SearchStack() {
  return (
    <SearchNav.Navigator screenOptions={stackOptions}>
      <SearchNav.Screen name={ROUTES.SEARCH} component={SearchScreen} />
      <SearchNav.Screen
        name={ROUTES.MOVIE_DETAILS}
        component={MovieDetailsScreen}
      />
      <SearchNav.Screen name={ROUTES.TV_DETAILS} component={TVDetailsScreen} />
      <SearchNav.Screen
        name={ROUTES.PERSON_DETAILS}
        component={PersonDetailsScreen}
      />
      <SearchNav.Screen name={ROUTES.GENRES} component={GenresScreen} />
      <SearchNav.Screen name={ROUTES.GENRE_LIST} component={GenreListScreen} />
    </SearchNav.Navigator>
  );
}

function FavoritesStack() {
  return (
    <FavoritesNav.Navigator screenOptions={stackOptions}>
      <FavoritesNav.Screen
        name={ROUTES.FAVORITES}
        component={FavoritesScreen}
      />
      <FavoritesNav.Screen
        name={ROUTES.MOVIE_DETAILS}
        component={MovieDetailsScreen}
      />
      <FavoritesNav.Screen
        name={ROUTES.TV_DETAILS}
        component={TVDetailsScreen}
      />
      <FavoritesNav.Screen
        name={ROUTES.PERSON_DETAILS}
        component={PersonDetailsScreen}
      />
      <FavoritesNav.Screen name={ROUTES.GENRES} component={GenresScreen} />
      <FavoritesNav.Screen
        name={ROUTES.GENRE_LIST}
        component={GenreListScreen}
      />
    </FavoritesNav.Navigator>
  );
}

function WatchlistStack() {
  return (
    <WatchlistNav.Navigator screenOptions={stackOptions}>
      <WatchlistNav.Screen
        name={ROUTES.WATCHLIST}
        component={WatchlistScreen}
      />
      <WatchlistNav.Screen
        name={ROUTES.MOVIE_DETAILS}
        component={MovieDetailsScreen}
      />
      <WatchlistNav.Screen
        name={ROUTES.TV_DETAILS}
        component={TVDetailsScreen}
      />
      <WatchlistNav.Screen
        name={ROUTES.PERSON_DETAILS}
        component={PersonDetailsScreen}
      />
      <WatchlistNav.Screen name={ROUTES.GENRES} component={GenresScreen} />
      <WatchlistNav.Screen
        name={ROUTES.GENRE_LIST}
        component={GenreListScreen}
      />
    </WatchlistNav.Navigator>
  );
}

function SettingsStack() {
  return (
    <SettingsNav.Navigator screenOptions={stackOptions}>
      <SettingsNav.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
    </SettingsNav.Navigator>
  );
}

// ─── Main Tab Navigator ──────────────────────────────────────────────────────

function renderTabIcon(routeName, focused, color, size) {
  const icons = TAB_ICONS[routeName];
  const iconName = icons
    ? focused
      ? icons.focused
      : icons.unfocused
    : 'ellipse-outline';
  return <Icon name={iconName} size={size} color={color} />;
}

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
        tabBarIcon: ({focused, color, size}) =>
          renderTabIcon(route.name, focused, color, size),
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
