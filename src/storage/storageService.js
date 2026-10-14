// CineVerse — AsyncStorage service for favorites and watchlist
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  FAVORITES: '@cineverse_favorites',
  WATCHLIST: '@cineverse_watchlist',
  ONBOARDING_DONE: '@cineverse_onboarding_done',
  THEME: '@cineverse_theme',
};

// ─── Generic Helpers ──────────────────────────────────────────────────────────

async function getList(key) {
  try {
    const json = await AsyncStorage.getItem(key);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.warn(`[Storage] Failed to read ${key}:`, e.message);
    return [];
  }
}

async function saveList(key, list) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.warn(`[Storage] Failed to write ${key}:`, e.message);
  }
}

function makeId(item) {
  // Combine id + media_type so a movie and TV show with the same id don't collide
  return `${item.media_type || 'movie'}_${item.id}`;
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export async function getFavorites() {
  return getList(KEYS.FAVORITES);
}

export async function addFavorite(item) {
  const list = await getFavorites();
  const exists = list.some(f => makeId(f) === makeId(item));
  if (!exists) {
    await saveList(KEYS.FAVORITES, [...list, item]);
  }
}

export async function removeFavorite(item) {
  const list = await getFavorites();
  const updated = list.filter(f => makeId(f) !== makeId(item));
  await saveList(KEYS.FAVORITES, updated);
}

export async function isFavorite(item) {
  const list = await getFavorites();
  return list.some(f => makeId(f) === makeId(item));
}

export async function clearFavorites() {
  await saveList(KEYS.FAVORITES, []);
}

// ─── Watchlist ────────────────────────────────────────────────────────────────

export async function getWatchlist() {
  return getList(KEYS.WATCHLIST);
}

export async function addToWatchlist(item) {
  const list = await getWatchlist();
  const exists = list.some(w => makeId(w) === makeId(item));
  if (!exists) {
    await saveList(KEYS.WATCHLIST, [...list, item]);
  }
}

export async function removeFromWatchlist(item) {
  const list = await getWatchlist();
  const updated = list.filter(w => makeId(w) !== makeId(item));
  await saveList(KEYS.WATCHLIST, updated);
}

export async function isInWatchlist(item) {
  const list = await getWatchlist();
  return list.some(w => makeId(w) === makeId(item));
}

export async function clearWatchlist() {
  await saveList(KEYS.WATCHLIST, []);
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export async function getOnboardingDone() {
  try {
    const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
    return val === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingDone() {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, 'true');
  } catch (e) {
    console.warn('[Storage] Failed to save onboarding state:', e.message);
  }
}

// ─── Clear All ───────────────────────────────────────────────────────────────

export async function clearAllStorage() {
  try {
    await AsyncStorage.multiRemove([
      KEYS.FAVORITES,
      KEYS.WATCHLIST,
      KEYS.ONBOARDING_DONE,
    ]);
  } catch (e) {
    console.warn('[Storage] Failed to clear storage:', e.message);
  }
}

export {KEYS};
