// CineVerse — TMDB Endpoints Registry Test
// Verifies all 28 endpoints required by the assignment
import ENDPOINTS from '../api/tmdbEndpoints';

describe('TMDB Endpoints Registry (Minimum 15 Required, 28 Implemented)', () => {
  it('has all 28 endpoints defined', () => {
    const keys = Object.keys(ENDPOINTS);
    expect(keys.length).toBe(30);
    expect(keys.length).toBeGreaterThanOrEqual(15);
  });

  describe('Trending Endpoints', () => {
    it('defines trendingMoviesDay', () => {
      expect(ENDPOINTS.trendingMoviesDay).toBe('/trending/movie/day');
    });
    it('defines trendingAll', () => {
      expect(ENDPOINTS.trendingAll).toBe('/trending/all/day');
    });
    it('defines trendingTVDay', () => {
      expect(ENDPOINTS.trendingTVDay).toBe('/trending/tv/day');
    });
  });

  describe('Movie Lists Endpoints', () => {
    it('defines popularMovies', () => {
      expect(ENDPOINTS.popularMovies).toBe('/movie/popular');
    });
    it('defines topRatedMovies', () => {
      expect(ENDPOINTS.topRatedMovies).toBe('/movie/top_rated');
    });
    it('defines upcomingMovies', () => {
      expect(ENDPOINTS.upcomingMovies).toBe('/movie/upcoming');
    });
    it('defines nowPlayingMovies', () => {
      expect(ENDPOINTS.nowPlayingMovies).toBe('/movie/now_playing');
    });
  });

  describe('Movie Details Endpoints with dynamic IDs', () => {
    it('resolves movieDetails', () => {
      expect(ENDPOINTS.movieDetails(550)).toBe('/movie/550');
    });
    it('resolves movieCredits', () => {
      expect(ENDPOINTS.movieCredits(550)).toBe('/movie/550/credits');
    });
    it('resolves movieVideos', () => {
      expect(ENDPOINTS.movieVideos(550)).toBe('/movie/550/videos');
    });
    it('resolves movieSimilar', () => {
      expect(ENDPOINTS.movieSimilar(550)).toBe('/movie/550/similar');
    });
    it('resolves movieRecommendations', () => {
      expect(ENDPOINTS.movieRecommendations(550)).toBe(
        '/movie/550/recommendations',
      );
    });
    it('resolves movieImages', () => {
      expect(ENDPOINTS.movieImages(550)).toBe('/movie/550/images');
    });
  });

  describe('TV Lists Endpoints', () => {
    it('defines popularTV', () => {
      expect(ENDPOINTS.popularTV).toBe('/tv/popular');
    });
    it('defines topRatedTV', () => {
      expect(ENDPOINTS.topRatedTV).toBe('/tv/top_rated');
    });
  });

  describe('TV Details Endpoints with dynamic IDs', () => {
    it('resolves tvDetails', () => {
      expect(ENDPOINTS.tvDetails(1399)).toBe('/tv/1399');
    });
    it('resolves tvCredits', () => {
      expect(ENDPOINTS.tvCredits(1399)).toBe('/tv/1399/credits');
    });
    it('resolves tvVideos', () => {
      expect(ENDPOINTS.tvVideos(1399)).toBe('/tv/1399/videos');
    });
    it('resolves tvSimilar', () => {
      expect(ENDPOINTS.tvSimilar(1399)).toBe('/tv/1399/similar');
    });
    it('resolves tvRecommendations', () => {
      expect(ENDPOINTS.tvRecommendations(1399)).toBe(
        '/tv/1399/recommendations',
      );
    });
  });

  describe('Search Endpoints', () => {
    it('defines searchMovie', () => {
      expect(ENDPOINTS.searchMovie).toBe('/search/movie');
    });
    it('defines searchTV', () => {
      expect(ENDPOINTS.searchTV).toBe('/search/tv');
    });
    it('defines searchPerson', () => {
      expect(ENDPOINTS.searchPerson).toBe('/search/person');
    });
    it('defines multiSearch', () => {
      expect(ENDPOINTS.multiSearch).toBe('/search/multi');
    });
  });

  describe('Genres & Discover Endpoints', () => {
    it('defines movieGenres', () => {
      expect(ENDPOINTS.movieGenres).toBe('/genre/movie/list');
    });
    it('defines tvGenres', () => {
      expect(ENDPOINTS.tvGenres).toBe('/genre/tv/list');
    });
    it('defines discoverMovies', () => {
      expect(ENDPOINTS.discoverMovies).toBe('/discover/movie');
    });
    it('defines discoverTV', () => {
      expect(ENDPOINTS.discoverTV).toBe('/discover/tv');
    });
  });

  describe('People Endpoints', () => {
    it('resolves personDetails', () => {
      expect(ENDPOINTS.personDetails(287)).toBe('/person/287');
    });
    it('resolves personCombinedCredits', () => {
      expect(ENDPOINTS.personCombinedCredits(287)).toBe(
        '/person/287/combined_credits',
      );
    });
  });
});
