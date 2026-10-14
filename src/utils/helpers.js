// CineVerse — Utility functions

/**
 * Format a runtime in minutes to "Xh Ym" string.
 */
export function formatRuntime(minutes) {
  if (!minutes) {
    return 'N/A';
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) {
    return `${m}m`;
  }
  if (m === 0) {
    return `${h}h`;
  }
  return `${h}h ${m}m`;
}

/**
 * Format a date string "YYYY-MM-DD" to "Month DD, YYYY".
 */
export function formatDate(dateStr) {
  if (!dateStr) {
    return 'N/A';
  }
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Extract release year from "YYYY-MM-DD".
 */
export function getYear(dateStr) {
  if (!dateStr || dateStr.length < 4) {
    return '';
  }
  return dateStr.substring(0, 4);
}

/**
 * Format TMDB vote_average (0-10) to one decimal.
 */
export function formatRating(rating) {
  if (rating === undefined || rating === null) {
    return '0.0';
  }
  return parseFloat(rating).toFixed(1);
}

/**
 * Format vote_count with K suffix.
 */
export function formatVoteCount(count) {
  if (!count) {
    return '0';
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
}

/**
 * Capitalize the first letter of each word.
 */
export function titleCase(str) {
  if (!str) {
    return '';
  }
  return str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Truncate text to maxLength with ellipsis.
 */
export function truncate(text, maxLength = 120) {
  if (!text) {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '…';
}

/**
 * Get the display title from a movie or TV object.
 * Movies use "title", TV shows use "name".
 */
export function getTitle(item) {
  return item?.title || item?.name || 'Unknown';
}

/**
 * Get the display date from a movie or TV object.
 */
export function getReleaseDate(item) {
  return item?.release_date || item?.first_air_date || '';
}

/**
 * Get media type label.
 */
export function getMediaTypeLabel(mediaType) {
  switch (mediaType) {
    case 'movie':
      return 'Movie';
    case 'tv':
      return 'TV Show';
    case 'person':
      return 'Person';
    default:
      return 'Unknown';
  }
}

/**
 * Debounce function for search inputs.
 */
export function debounce(fn, delay = 400) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Safely extract results array from a TMDB list response.
 */
export function extractResults(response) {
  return response?.data?.results || [];
}

/**
 * Safely extract total pages from a TMDB list response.
 */
export function extractTotalPages(response) {
  return response?.data?.total_pages || 1;
}

/**
 * Filter duplicate items by id.
 */
export function deduplicateById(arr) {
  const seen = new Set();
  return arr.filter(item => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}

/**
 * Format currency (for budget/revenue).
 */
export function formatCurrency(amount) {
  if (!amount) {
    return 'N/A';
  }
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return `$${amount.toLocaleString()}`;
}

/**
 * Get rating color based on score (0-10).
 */
export function getRatingColor(rating) {
  if (rating >= 7) {
    return '#4CAF50';
  }
  if (rating >= 5) {
    return '#FF9800';
  }
  return '#F44336';
}
