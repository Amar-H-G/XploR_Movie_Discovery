// CineVerse — Axios client for TMDB API v3
import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

let envConfig = {};
try {
  const mod = require('./envConfig');
  envConfig = mod.default || mod || {};
} catch {
  // Optional untracked config
}

// Read tokens from envConfig / process.env if injected, with default fallback
let runtimeToken =
  envConfig.TMDB_BEARER_TOKEN || process.env.TMDB_BEARER_TOKEN || '';
let runtimeApiKey = envConfig.TMDB_API_KEY || process.env.TMDB_API_KEY || '';

export const setRuntimeToken = token => {
  runtimeToken = token;
};

export const setRuntimeApiKey = apiKey => {
  runtimeApiKey = apiKey;
};

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor — inject auth headers or api_key query param dynamically
axiosClient.interceptors.request.use(
  config => {
    // Inject Authorization header if Bearer token is available
    if (runtimeToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${runtimeToken}`;
    }

    // Inject api_key as query param if available and no Bearer token
    if (runtimeApiKey && !runtimeToken) {
      config.params = {
        api_key: runtimeApiKey,
        ...config.params,
      };
    }

    if (__DEV__) {
      // Safe logging that strips secrets
      const safeUrl = (config.url || '').split('?')[0];
      console.log(`[TMDB API] ${config.method?.toUpperCase()} ${safeUrl}`);
    }
    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor — normalize errors securely without exposing credentials
axiosClient.interceptors.response.use(
  response => response,
  error => {
    const normalizedError = normalizeError(error);
    return Promise.reject(normalizedError);
  },
);

function normalizeError(error) {
  if (error.response) {
    const status = error.response.status;
    const serverMessage =
      error.response.data?.status_message || 'An error occurred';
    switch (status) {
      case 401:
        return new Error(
          'TMDB Authentication Required: Please check your API Read Access Token in Settings.',
        );
      case 403:
        return new Error(
          'Access forbidden: Please check your TMDB account permissions.',
        );
      case 404:
        return new Error(
          'The requested movie or content was not found on TMDB.',
        );
      case 429:
        return new Error(
          'TMDB Rate limit reached: Please pause for a moment and retry.',
        );
      default:
        return new Error(
          `TMDB Server responded with (${status}): ${serverMessage}`,
        );
    }
  }
  if (error.request) {
    return new Error(
      'Network error: Unable to connect to TMDB. Please check your internet connection.',
    );
  }
  return new Error(
    error.message ||
      'An unexpected error occurred while communicating with TMDB.',
  );
}

export default axiosClient;
