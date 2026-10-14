// CineVerse — TMDB Image URL builder
// Official TMDB image base URL and available sizes

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const PosterSize = {
  w92: 'w92',
  w154: 'w154',
  w185: 'w185',
  w342: 'w342',
  w500: 'w500',
  w780: 'w780',
  original: 'original',
};

export const BackdropSize = {
  w300: 'w300',
  w780: 'w780',
  w1280: 'w1280',
  original: 'original',
};

export const ProfileSize = {
  w45: 'w45',
  w185: 'w185',
  h632: 'h632',
  original: 'original',
};

export const StillSize = {
  w92: 'w92',
  w185: 'w185',
  w300: 'w300',
  original: 'original',
};

/**
 * Build a full TMDB image URL.
 * @param {string|null} path  — TMDB path like "/xyz.jpg"
 * @param {string} size       — size token from PosterSize/BackdropSize/ProfileSize
 * @returns {string|null}     — full URL or null if path is missing
 */
export function buildImageUrl(path, size = PosterSize.w500) {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function buildPosterUrl(path, size = PosterSize.w342) {
  return buildImageUrl(path, size);
}

export function buildBackdropUrl(path, size = BackdropSize.w780) {
  return buildImageUrl(path, size);
}

export function buildProfileUrl(path, size = ProfileSize.w185) {
  return buildImageUrl(path, size);
}

export function buildStillUrl(path, size = StillSize.w300) {
  return buildImageUrl(path, size);
}

export function buildYouTubeThumbnail(key) {
  if (!key) {
    return null;
  }
  return `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
}
