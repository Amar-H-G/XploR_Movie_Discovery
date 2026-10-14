// CineVerse — TMDB API Endpoint Definitions
// All 28 implemented endpoint paths in one place

const ENDPOINTS = {
  // ─── Trending ────────────────────────────────────────────────────────────────
  trendingMoviesDay: '/trending/movie/day',
  trendingAll: '/trending/all/day',
  trendingTVDay: '/trending/tv/day',

  // ─── Movie lists ─────────────────────────────────────────────────────────────
  popularMovies: '/movie/popular',
  topRatedMovies: '/movie/top_rated',
  upcomingMovies: '/movie/upcoming',
  nowPlayingMovies: '/movie/now_playing',

  // ─── Movie details ───────────────────────────────────────────────────────────
  movieDetails: id => `/movie/${id}`,
  movieCredits: id => `/movie/${id}/credits`,
  movieVideos: id => `/movie/${id}/videos`,
  movieSimilar: id => `/movie/${id}/similar`,
  movieRecommendations: id => `/movie/${id}/recommendations`,
  movieImages: id => `/movie/${id}/images`,

  // ─── TV lists ────────────────────────────────────────────────────────────────
  popularTV: '/tv/popular',
  topRatedTV: '/tv/top_rated',

  // ─── TV details ──────────────────────────────────────────────────────────────
  tvDetails: id => `/tv/${id}`,
  tvCredits: id => `/tv/${id}/credits`,
  tvVideos: id => `/tv/${id}/videos`,
  tvSimilar: id => `/tv/${id}/similar`,
  tvRecommendations: id => `/tv/${id}/recommendations`,

  // ─── Search ──────────────────────────────────────────────────────────────────
  searchMovie: '/search/movie',
  searchTV: '/search/tv',
  searchPerson: '/search/person',
  multiSearch: '/search/multi',

  // ─── Genres ──────────────────────────────────────────────────────────────────
  movieGenres: '/genre/movie/list',
  tvGenres: '/genre/tv/list',

  // ─── Discover ────────────────────────────────────────────────────────────────
  discoverMovies: '/discover/movie',
  discoverTV: '/discover/tv',

  // ─── People ──────────────────────────────────────────────────────────────────
  personDetails: id => `/person/${id}`,
  personCombinedCredits: id => `/person/${id}/combined_credits`,
};

export default ENDPOINTS;
