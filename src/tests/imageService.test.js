// CineVerse — ImageService Unit Tests
import {
  buildImageUrl,
  buildPosterUrl,
  buildBackdropUrl,
  buildProfileUrl,
  buildStillUrl,
  buildYouTubeThumbnail,
  PosterSize,
  BackdropSize,
  ProfileSize,
  StillSize,
} from '../api/imageService';

describe('ImageService URL Construction', () => {
  const mockPath = '/testImage123.jpg';

  it('builds full image URL with default size', () => {
    const url = buildImageUrl(mockPath);
    expect(url).toBe('https://image.tmdb.org/t/p/w500/testImage123.jpg');
  });

  it('returns null when path is missing or null', () => {
    expect(buildImageUrl(null)).toBeNull();
    expect(buildImageUrl('')).toBeNull();
    expect(buildImageUrl(undefined)).toBeNull();
  });

  it('builds poster URL with correct size', () => {
    expect(buildPosterUrl(mockPath, PosterSize.w342)).toBe(
      'https://image.tmdb.org/t/p/w342/testImage123.jpg',
    );
    expect(buildPosterUrl(mockPath, PosterSize.w780)).toBe(
      'https://image.tmdb.org/t/p/w780/testImage123.jpg',
    );
  });

  it('builds backdrop URL with w780 default', () => {
    expect(buildBackdropUrl(mockPath)).toBe(
      'https://image.tmdb.org/t/p/w780/testImage123.jpg',
    );
    expect(buildBackdropUrl(mockPath, BackdropSize.w1280)).toBe(
      'https://image.tmdb.org/t/p/w1280/testImage123.jpg',
    );
  });

  it('builds profile URL for cast members', () => {
    expect(buildProfileUrl(mockPath, ProfileSize.w185)).toBe(
      'https://image.tmdb.org/t/p/w185/testImage123.jpg',
    );
  });

  it('builds still URL for episodes and scenes', () => {
    expect(buildStillUrl(mockPath, StillSize.w300)).toBe(
      'https://image.tmdb.org/t/p/w300/testImage123.jpg',
    );
  });

  it('builds YouTube thumbnail URL', () => {
    expect(buildYouTubeThumbnail('dQw4w9WgXcQ')).toBe(
      'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    );
    expect(buildYouTubeThumbnail(null)).toBeNull();
    expect(buildYouTubeThumbnail('')).toBeNull();
  });
});
