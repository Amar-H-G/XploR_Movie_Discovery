// CineVerse — StorageService Unit Tests
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  clearFavorites,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  clearWatchlist,
  getOnboardingDone,
  setOnboardingDone,
  clearAllStorage,
} from '../storage/storageService';

describe('StorageService (AsyncStorage Persistence)', () => {
  beforeEach(async () => {
    await clearAllStorage();
  });

  describe('Favorites Management', () => {
    const movie = {id: 101, title: 'Inception', media_type: 'movie'};
    const tvShow = {id: 101, name: 'Arcane', media_type: 'tv'};

    it('starts with an empty favorites list', async () => {
      const favs = await getFavorites();
      expect(favs).toEqual([]);
    });

    it('adds and verifies favorite item', async () => {
      await addFavorite(movie);
      const isFav = await isFavorite(movie);
      expect(isFav).toBe(true);

      const list = await getFavorites();
      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(101);
    });

    it('does not duplicate items with same id and media_type', async () => {
      await addFavorite(movie);
      await addFavorite(movie);
      const list = await getFavorites();
      expect(list).toHaveLength(1);
    });

    it('distinguishes between movie and tv show with identical numeric IDs', async () => {
      await addFavorite(movie);
      await addFavorite(tvShow);
      const list = await getFavorites();
      expect(list).toHaveLength(2);
      expect(await isFavorite(movie)).toBe(true);
      expect(await isFavorite(tvShow)).toBe(true);
    });

    it('removes favorite item', async () => {
      await addFavorite(movie);
      await removeFavorite(movie);
      expect(await isFavorite(movie)).toBe(false);
      const list = await getFavorites();
      expect(list).toEqual([]);
    });

    it('clears all favorites', async () => {
      await addFavorite(movie);
      await addFavorite(tvShow);
      await clearFavorites();
      expect(await getFavorites()).toEqual([]);
    });
  });

  describe('Watchlist Management', () => {
    const movie = {id: 202, title: 'Interstellar', media_type: 'movie'};

    it('starts empty', async () => {
      expect(await getWatchlist()).toEqual([]);
    });

    it('adds to watchlist and verifies', async () => {
      await addToWatchlist(movie);
      expect(await isInWatchlist(movie)).toBe(true);
      const list = await getWatchlist();
      expect(list).toHaveLength(1);
    });

    it('removes from watchlist', async () => {
      await addToWatchlist(movie);
      await removeFromWatchlist(movie);
      expect(await isInWatchlist(movie)).toBe(false);
    });

    it('clears watchlist', async () => {
      await addToWatchlist(movie);
      await clearWatchlist();
      expect(await getWatchlist()).toEqual([]);
    });
  });

  describe('Onboarding State Persistence', () => {
    it('defaults to false before completion', async () => {
      const done = await getOnboardingDone();
      expect(done).toBe(false);
    });

    it('sets onboarding done to true', async () => {
      await setOnboardingDone();
      const done = await getOnboardingDone();
      expect(done).toBe(true);
    });
  });
});
