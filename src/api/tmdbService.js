// CineVerse — TMDB Service Functions
// All API calls go through this module, using the centralized Axios client + endpoint registry.

import axiosClient from './axiosClient';
import ENDPOINTS from './tmdbEndpoints';

const DEFAULT_LANGUAGE = 'en-US';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function get(url, params = {}, signal) {
  return axiosClient.get(url, {
    params: {language: DEFAULT_LANGUAGE, ...params},
    signal,
  });
}

// ─── Trending ────────────────────────────────────────────────────────────────

export const getTrendingMovies = signal =>
  get(ENDPOINTS.trendingMoviesDay, {}, signal);

export const getTrendingAll = signal => get(ENDPOINTS.trendingAll, {}, signal);

export const getTrendingTV = signal => get(ENDPOINTS.trendingTVDay, {}, signal);

// ─── Movie Lists ──────────────────────────────────────────────────────────────

export const getPopularMovies = (page = 1, signal) =>
  get(ENDPOINTS.popularMovies, {page}, signal);

export const getTopRatedMovies = (page = 1, signal) =>
  get(ENDPOINTS.topRatedMovies, {page}, signal);

export const getUpcomingMovies = (page = 1, signal) =>
  get(ENDPOINTS.upcomingMovies, {page}, signal);

export const getNowPlayingMovies = (page = 1, signal) =>
  get(ENDPOINTS.nowPlayingMovies, {page}, signal);

// ─── Movie Details ────────────────────────────────────────────────────────────

export const getMovieDetails = (movieId, signal) =>
  get(ENDPOINTS.movieDetails(movieId), {}, signal);

export const getMovieCredits = (movieId, signal) =>
  get(ENDPOINTS.movieCredits(movieId), {}, signal);

export const getMovieVideos = (movieId, signal) =>
  get(ENDPOINTS.movieVideos(movieId), {}, signal);

export const getMovieSimilar = (movieId, page = 1, signal) =>
  get(ENDPOINTS.movieSimilar(movieId), {page}, signal);

export const getMovieRecommendations = (movieId, page = 1, signal) =>
  get(ENDPOINTS.movieRecommendations(movieId), {page}, signal);

export const getMovieImages = (movieId, signal) =>
  get(
    ENDPOINTS.movieImages(movieId),
    {include_image_language: 'en,null'},
    signal,
  );

// ─── TV Lists ────────────────────────────────────────────────────────────────

export const getPopularTV = (page = 1, signal) =>
  get(ENDPOINTS.popularTV, {page}, signal);

export const getTopRatedTV = (page = 1, signal) =>
  get(ENDPOINTS.topRatedTV, {page}, signal);

// ─── TV Details ──────────────────────────────────────────────────────────────

export const getTVDetails = (seriesId, signal) =>
  get(ENDPOINTS.tvDetails(seriesId), {}, signal);

export const getTVCredits = (seriesId, signal) =>
  get(ENDPOINTS.tvCredits(seriesId), {}, signal);

export const getTVVideos = (seriesId, signal) =>
  get(ENDPOINTS.tvVideos(seriesId), {}, signal);

export const getTVSimilar = (seriesId, page = 1, signal) =>
  get(ENDPOINTS.tvSimilar(seriesId), {page}, signal);

export const getTVRecommendations = (seriesId, page = 1, signal) =>
  get(ENDPOINTS.tvRecommendations(seriesId), {page}, signal);

// ─── Search ──────────────────────────────────────────────────────────────────

export const searchMovies = (query, page = 1, signal) =>
  get(ENDPOINTS.searchMovie, {query, page, include_adult: false}, signal);

export const searchTV = (query, page = 1, signal) =>
  get(ENDPOINTS.searchTV, {query, page, include_adult: false}, signal);

export const searchPerson = (query, page = 1, signal) =>
  get(ENDPOINTS.searchPerson, {query, page, include_adult: false}, signal);

export const multiSearch = (query, page = 1, signal) =>
  get(ENDPOINTS.multiSearch, {query, page, include_adult: false}, signal);

// ─── Genres ──────────────────────────────────────────────────────────────────

export const getMovieGenres = signal => get(ENDPOINTS.movieGenres, {}, signal);

export const getTVGenres = signal => get(ENDPOINTS.tvGenres, {}, signal);

// ─── Discover ────────────────────────────────────────────────────────────────

export const discoverMovies = (params = {}, signal) =>
  get(
    ENDPOINTS.discoverMovies,
    {sort_by: 'popularity.desc', ...params},
    signal,
  );

export const discoverTV = (params = {}, signal) =>
  get(ENDPOINTS.discoverTV, {sort_by: 'popularity.desc', ...params}, signal);

// ─── People ──────────────────────────────────────────────────────────────────

export const getPersonDetails = (personId, signal) =>
  get(ENDPOINTS.personDetails(personId), {}, signal);

export const getPersonCombinedCredits = (personId, signal) =>
  get(ENDPOINTS.personCombinedCredits(personId), {}, signal);
