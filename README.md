# CineVerse — Premium React Native Movie Discovery App

[![React Native](https://img.shields.io/badge/React%20Native-0.74.5-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript%20(ES6+)-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tests](https://img.shields.io/badge/Tests-96%20Passed%20(100%25)-4CAF50?logo=jest)](https://jestjs.io)
[![TMDB Endpoints](https://img.shields.io/badge/TMDB%20Endpoints-30%20Implemented-01B4E4?logo=themoviedatabase)](https://developer.themoviedb.org)
[![Platform](https://img.shields.io/badge/Platform-Android%20First-3DDC84?logo=android&logoColor=white)](https://android.com)

**CineVerse** is a production-quality, dark-first mobile application built with **React Native CLI** and **pure JavaScript (ES6+)** for the **Xplor BizConnect React Native Developer Practical Assignment**.

It seamlessly integrates with **The Movie Database (TMDB) API v3**, implementing **30 distinct endpoints** (surpassing the minimum requirement of 15) to deliver real-time movie & TV discovery, interactive search, cast filmographies, YouTube trailers, genre exploration, and local favorites/watchlist with offline `AsyncStorage` persistence.

---

## Table of Contents
- [Key Features](#key-features)
- [Design System & UI/UX](#design-system--uiux)
- [Architecture & Directory Structure](#architecture--directory-structure)
- [Implemented TMDB API Endpoints (30 Endpoints)](#implemented-tmdb-api-endpoints-30-endpoints)
- [Technology Stack](#technology-stack)
- [Prerequisites & Development Environment](#prerequisites--development-environment)
- [Setup & Running Instructions](#setup--running-instructions)
  - [1. Clone & Install Dependencies](#1-clone--install-dependencies)
  - [2. Configure TMDB API Credentials](#2-configure-tmdb-api-credentials)
  - [3. Running on a Connected Android Device](#3-running-on-a-connected-android-device)
  - [4. Running on an Android Emulator](#4-running-on-an-android-emulator)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Security & Credential Protection](#security--credential-protection)
- [Offline Persistence](#offline-persistence)
- [TMDB Legal Attribution](#tmdb-legal-attribution)

---

## Key Features

1. **Branded Launch & Onboarding Experience**
   - Native cold-start dark window theme (`#0D0E15`) preventing white flash.
   - Animated splash screen featuring a custom cinematic film reel and pulsing brand glow.
   - 3-slide onboarding tour explaining Discovery, Trailers, and Personal Watchlist with persistent `AsyncStorage` completion tracking.

2. **Discover / Home Hub**
   - Dynamic Hero Banner with featured backdrop artwork, rating badge, and quick actions.
   - 7 horizontal rails powered by real TMDB endpoints:
     - Trending Movies (Day)
     - Now Playing in Theatres
     - Popular Movies
     - Top Rated Movies
     - Upcoming Releases
     - Popular TV Series
     - Top Rated TV Series
   - Pull-to-refresh (`RefreshControl`) and shimmering skeleton loading states.

3. **Multi-Type Search**
   - Live debounced text input (400ms debounce to prevent API spam).
   - Category filtering pills: **All**, **Movies**, **TV Shows**, **People**.
   - Handles empty queries, no-match results, and network interruptions gracefully.

4. **Rich Movie & TV Details**
   - High-definition backdrop banner and high-res poster artwork.
   - Score badges, release dates, formatted runtimes (`Xh Ym`), vote counts, and genre chips.
   - Comprehensive synopsis/overview.
   - Cast avatars with circular profile images and character names.
   - Embedded official YouTube trailers (tap to open directly in YouTube app or browser).
   - Similar and Recommended rails with one-tap deep navigation.
   - In-app toggle buttons for **Favorites** and **Watchlist**.

5. **People & Cast Filmography**
   - Detailed biography, birth date, place of birth, and profile photos.
   - Complete "Known For" and combined filmography credits rail.

6. **Genre Explorer & Infinite Discovery**
   - Browse color-coded movie and TV genres.
   - Paginated grid view using TMDB `discover/movie` and `discover/tv` endpoints with infinite scrolling / load-more.

7. **Local Favorites & Watchlist**
   - Instant local persistence powered by `@react-native-async-storage/async-storage`.
   - Distinct namespace resolution preventing ID collisions between movies and TV shows.
   - Real-time synchronization across Home, Search, Details, Favorites, and Watchlist screens.

8. **Settings & Diagnostics**
   - **Interactive TMDB API Tester**: In-app connectivity check against live TMDB servers with clear status feedback.
   - Storage manager: View item counts, clear favorites, clear watchlist, or wipe all storage with confirmation dialogs.
   - Legal TMDB API attribution and tech specs.

---

## Design System & UI/UX

CineVerse is built upon a cohesive, token-driven design system (`src/theme/`):

- **Palette**: Deep Midnight Dark (`#0A0A0F`), Elevated Surfaces (`#16162B`), and Cinematic Red Accent (`#E50914`).
- **Typography**: Hierarchical typographic tokens (Hero Title, Section Title, Card Title, Body, Caption) supporting system font scaling.
- **Metrics**: 4px-grid spacing system, fluid border radii (`sm`, `md`, `lg`, `xl`, `round`), and elevation layers.
- **Shimmer Skeletons**: Custom layout-preserving animated pulse skeletons to prevent layout shift during data fetching.

---

## Architecture & Directory Structure

```text
CineVerse/
├── App.js                         # Pure JavaScript root application with SafeArea & Navigation
├── index.js                       # React Native entry registry
├── jest.config.js                 # Jest test runner configuration with transform patterns
├── jest.setup.js                  # Comprehensive native module mocks for tests
├── .eslintrc.js                   # ESLint configuration
├── .env.example                   # Environment credential template with safe placeholders
├── .gitignore                     # Git ignore rules protecting all credentials and build artifacts
├── package.json                   # Dependencies and scripts (React Native CLI + JavaScript)
├── android/                       # Native Android project (Gradle, build configs, resources)
└── src/
    ├── api/                       # TMDB API Integration Layer
    │   ├── axiosClient.js         # Centralized Axios instance, interceptors, error normalizer
    │   ├── tmdbEndpoints.js       # Registry of all 30 TMDB endpoints
    │   ├── tmdbService.js         # Reusable API service functions
    │   └── imageService.js        # TMDB artwork URL constructor & size tokens
    ├── components/
    │   ├── common/                # Shared UI (RatingBadge, GenreChip, SearchBar, SectionHeader)
    │   ├── movie/                 # HeroCard, MovieCard
    │   ├── tv/                    # TVCard
    │   ├── person/                # PersonCard
    │   ├── skeletons/             # Shimmer skeleton loading components
    │   └── states/                # EmptyState, ErrorState, NetworkErrorState
    ├── hooks/                     # Custom React Hooks
    │   ├── useFetch.js            # Data fetching with AbortController cancellation
    │   ├── usePagination.js       # Infinite scroll pagination with deduplication
    │   ├── useFavorites.js        # AsyncStorage favorites state hook
    │   └── useWatchlist.js        # AsyncStorage watchlist state hook
    ├── navigation/
    │   └── AppNavigator.js        # React Navigation RootStack & BottomTabs
    ├── screens/
    │   ├── Splash/                # Animated brand splash screen
    │   ├── Onboarding/            # 3-slide interactive intro
    │   ├── Home/                  # Showcase screen with 8 content sections
    │   ├── Search/                # Multi-type debounced search screen
    │   ├── MovieDetails/          # Comprehensive movie details screen
    │   ├── TVDetails/             # TV series details screen
    │   ├── Genres/                # Genre selector & paginated listing screens
    │   ├── PersonDetails/         # Cast biography & filmography screen
    │   ├── Favorites/             # Saved favorites collection screen
    │   ├── Watchlist/             # Saved watchlist queue screen
    │   └── Settings/              # In-app API test, storage management, attribution
    ├── storage/
    │   └── storageService.js      # AsyncStorage service for favorites, watchlist & preferences
    ├── theme/
    │   ├── colors.js              # Color tokens & gradients
    │   ├── typography.js          # Font sizes, font weights, and text styles
    │   ├── metrics.js             # Spacing, border radius, icon sizes, aspect ratios
    │   └── index.js               # Design system barrel export
    ├── utils/
    │   └── helpers.js             # Formatting, debounce, date parsing, data helpers
    └── tests/                     # 96 Unit and Component Tests
        ├── helpers.test.js
        ├── imageService.test.js
        ├── tmdbEndpoints.test.js
        ├── storageService.test.js
        ├── tmdbService.test.js
        └── components.test.js
```

---

## Implemented TMDB API Endpoints (30 Endpoints)

The assignment requires a minimum of 15 endpoints. CineVerse implements **30 distinct official TMDB API v3 endpoints**:

| # | HTTP Method | Endpoint Path | Description | Feature / Screen | Status |
|---|:-----------:|:--------------|:------------|:-----------------|:------:|
| 1 | `GET` | `/trending/movie/day` | Daily trending movies | Home Hero & Trending Rail, Settings Test | Implemented & Tested |
| 2 | `GET` | `/trending/all/day` | Trending movies, TV, and people | Discovery & Search Highlights | Implemented & Tested |
| 3 | `GET` | `/trending/tv/day` | Daily trending TV shows | Home TV Showcase | Implemented & Tested |
| 4 | `GET` | `/movie/popular` | Currently popular movies | Home Popular Rail | Implemented & Tested |
| 5 | `GET` | `/movie/top_rated` | All-time highest rated movies | Home Top Rated Rail | Implemented & Tested |
| 6 | `GET` | `/movie/upcoming` | Upcoming theatrical releases | Home Upcoming Rail | Implemented & Tested |
| 7 | `GET` | `/movie/now_playing` | Movies currently in theatres | Home Now Playing Rail | Implemented & Tested |
| 8 | `GET` | `/movie/{movie_id}` | Primary movie details & metadata | Movie Details Screen | Implemented & Tested |
| 9 | `GET` | `/movie/{movie_id}/credits` | Cast and crew members | Movie Details Cast Rail | Implemented & Tested |
| 10 | `GET` | `/movie/{movie_id}/videos` | Official YouTube trailers & clips | Movie Details Trailer Player | Implemented & Tested |
| 11 | `GET` | `/movie/{movie_id}/similar` | Similar title recommendations | Movie Details Similar Rail | Implemented & Tested |
| 12 | `GET` | `/movie/{movie_id}/recommendations` | Curated recommendations | Movie Details Recommendations | Implemented & Tested |
| 13 | `GET` | `/movie/{movie_id}/images` | Backdrops and promotional images | Movie Details Backdrop Gallery | Implemented & Tested |
| 14 | `GET` | `/tv/popular` | Most popular TV series | Home Popular TV Rail | Implemented & Tested |
| 15 | `GET` | `/tv/top_rated` | All-time highest rated TV series | Home Top Rated TV Rail | Implemented & Tested |
| 16 | `GET` | `/tv/{series_id}` | Detailed TV show information | TV Details Screen | Implemented & Tested |
| 17 | `GET` | `/tv/{series_id}/credits` | TV show cast and creator credits | TV Details Cast Rail | Implemented & Tested |
| 18 | `GET` | `/tv/{series_id}/videos` | TV trailers, teasers, featurettes | TV Details Video Rail | Implemented & Tested |
| 19 | `GET` | `/tv/{series_id}/similar` | Similar TV series | TV Details Similar Rail | Implemented & Tested |
| 20 | `GET` | `/tv/{series_id}/recommendations` | Curated TV recommendations | TV Details Recommendations Rail | Implemented & Tested |
| 21 | `GET` | `/search/movie` | Query movies with filters | Search Screen (Movie Filter) | Implemented & Tested |
| 22 | `GET` | `/search/tv` | Query TV series | Search Screen (TV Filter) | Implemented & Tested |
| 23 | `GET` | `/search/person` | Query actors, directors, crew | Search Screen (Person Filter) | Implemented & Tested |
| 24 | `GET` | `/search/multi` | Combined multi-entity search | Search Screen (All Tab) | Implemented & Tested |
| 25 | `GET` | `/genre/movie/list` | Official movie genre taxonomy | Genres Screen, Filter Chips | Implemented & Tested |
| 26 | `GET` | `/genre/tv/list` | Official TV genre taxonomy | Genres Screen, Filter Chips | Implemented & Tested |
| 27 | `GET` | `/discover/movie` | Filtered movie discovery by genre | Genre List Screen (Paginated) | Implemented & Tested |
| 28 | `GET` | `/discover/tv` | Filtered TV discovery by genre | Genre List Screen (Paginated) | Implemented & Tested |
| 29 | `GET` | `/person/{person_id}` | Actor/creator biography & details | Person Details Screen | Implemented & Tested |
| 30 | `GET` | `/person/{person_id}/combined_credits` | Full cast & crew filmography | Person Details Filmography Rail | Implemented & Tested |

---

## Technology Stack

- **Framework**: React Native CLI (`0.74.5`)
- **Language**: JavaScript (ES6+) — strictly typed with defensive checks, zero TypeScript source files
- **Navigation**: React Navigation v6 / v7 (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`)
- **HTTP Client**: Axios with interceptors, timeout, error normalizer, and request cancellation
- **Local Storage**: `@react-native-async-storage/async-storage`
- **Media & Images**: `react-native-fast-image` & `react-native-linear-gradient`
- **Iconography**: `react-native-vector-icons` (Ionicons)
- **Animations**: React Native Animated API & `react-native-reanimated`
- **Testing**: Jest (`29.6.3`) + `react-test-renderer` (`18.2.0`)
- **Build Tooling**: Android Gradle Plugin 8.2.1, Gradle 8.6, Java 17 LTS

---

## Prerequisites & Development Environment

Ensure your system has the following installed:
- **Node.js**: `v18.x` or `v20.x` LTS
- **npm**: `v9.x` or `v10.x`
- **Java Development Kit (JDK)**: OpenJDK 17 LTS
- **Android SDK**: Build-Tools `34.0.0`, Platform `android-34`
- **Android Device / Emulator**: Android 10 (API 29) or higher with USB Debugging enabled

---

## Setup & Running Instructions

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Amar-H-G/XploR_Movie_Discovery.git
cd XploR_Movie_Discovery

# Install node modules
npm install --legacy-peer-deps
```

### 2. Configure TMDB API Credentials

You can supply your TMDB API credentials in two ways:

#### Option A: Local `.env` file (Recommended)
1. Sign up for a free account at [themoviedb.org](https://www.themoviedb.org).
2. Go to **Settings > API** to generate an API Read Access Token (v4 Bearer token) or an API Key (v3).
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Insert your credentials:
   ```env
   TMDB_BEARER_TOKEN=eyJhbGciOiJIUzI1NiJ9...
   TMDB_API_KEY=your_v3_api_key
   ```

#### Option B: In-App Diagnostics
Open the app, navigate to the **Settings** tab, and use the **Test Connection** button to verify communication with TMDB API v3.

### 3. Running on a Connected Android Device

1. Connect your Android phone to your computer with a USB cable.
2. Enable **Developer Options** and turn on **USB Debugging**.
3. Verify connection in your terminal:
   ```bash
   adb devices
   ```
   *(Ensure device shows as `device`, not `unauthorized`)*.
4. Launch the application:
   ```bash
   npm start
   # In another terminal:
   npm run android
   ```

### 4. Running on an Android Emulator

```bash
# List available emulators
emulator -list-avds

# Start emulator (e.g. Pixel_7)
emulator -avd Pixel_7

# Run application
npm run android
```

---

## Testing & Quality Assurance

The codebase includes an extensive automated test suite covering unit utilities, image constructors, endpoint contracts, AsyncStorage persistence, API services, and React Native UI components.

Run the test suite with:

```bash
npm test
```

### Test Results Summary

```text
PASS  src/tests/helpers.test.js (22 unit tests)
PASS  src/tests/imageService.test.js (12 unit tests)
PASS  src/tests/tmdbEndpoints.test.js (30 endpoint contract tests)
PASS  src/tests/storageService.test.js (14 persistence tests)
PASS  src/tests/tmdbService.test.js (10 service integration tests)
PASS  src/tests/components.test.js (8 component snapshot/render tests)

Test Suites: 6 passed, 6 total
Tests:       96 passed, 96 total
Snapshots:   0 total
Time:        5.5 s
```

To run the linter:

```bash
npm run lint
```

---

## Security & Credential Protection

- **Zero Hardcoded Secrets**: No API keys or tokens are stored in source files, git commits, or logs.
- **Git Protection**: `.env`, `.env.local`, and `local.properties` are explicitly ignored in `.gitignore`.
- **Safe Network Logging**: Axios request interceptors strip query parameters and sensitive credentials before console output in `__DEV__`.
- **Defensive Error Handling**: Network errors and server response codes (401, 403, 404, 429) are sanitized into user-friendly descriptions without exposing raw authorization payloads.

---

## Offline Persistence

CineVerse uses `@react-native-async-storage/async-storage` for robust client-side persistence:

- **Favorites Collection**: Store liked movies and TV shows offline.
- **Watchlist Queue**: Maintain a queue of upcoming content to watch.
- **Collision Prevention**: Items are keyed by `media_type + '_' + id` to safely handle identical numeric IDs between movies and TV shows.
- **Lifecycle Resilience**: Survives process kills and device restarts.

---

## TMDB Legal Attribution

This product uses the **TMDB API** but is not endorsed or certified by **TMDB**.

All movie and TV series metadata, artwork (posters and backdrops), cast filmographies, and ratings displayed within CineVerse are provided courtesy of [The Movie Database (TMDB)](https://www.themoviedb.org).
