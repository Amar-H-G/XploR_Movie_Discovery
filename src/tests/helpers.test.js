// CineVerse — Helpers Unit Tests
import {
  formatRuntime,
  formatDate,
  getYear,
  formatRating,
  formatVoteCount,
  titleCase,
  truncate,
  getTitle,
  getReleaseDate,
  getMediaTypeLabel,
  clamp,
  extractResults,
  extractTotalPages,
  deduplicateById,
  formatCurrency,
  getRatingColor,
} from '../utils/helpers';

describe('Helpers Utility Functions', () => {
  describe('formatRuntime', () => {
    it('formats minutes into h and m', () => {
      expect(formatRuntime(142)).toBe('2h 22m');
      expect(formatRuntime(60)).toBe('1h');
      expect(formatRuntime(45)).toBe('45m');
    });

    it('returns N/A when minutes is falsy', () => {
      expect(formatRuntime(0)).toBe('N/A');
      expect(formatRuntime(null)).toBe('N/A');
      expect(formatRuntime(undefined)).toBe('N/A');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date to human readable string', () => {
      const formatted = formatDate('2024-05-15');
      expect(formatted).toContain('2024');
      expect(formatted).toContain('May');
    });

    it('returns N/A for empty values', () => {
      expect(formatDate('')).toBe('N/A');
      expect(formatDate(null)).toBe('N/A');
    });
  });

  describe('getYear', () => {
    it('extracts 4-digit year', () => {
      expect(getYear('2023-11-03')).toBe('2023');
      expect(getYear('1994-09-23')).toBe('1994');
    });

    it('returns empty string if invalid', () => {
      expect(getYear('')).toBe('');
      expect(getYear(null)).toBe('');
    });
  });

  describe('formatRating', () => {
    it('formats float to 1 decimal place', () => {
      expect(formatRating(8.54)).toBe('8.5');
      expect(formatRating(7)).toBe('7.0');
      expect(formatRating(0)).toBe('0.0');
    });

    it('returns 0.0 for undefined/null', () => {
      expect(formatRating(null)).toBe('0.0');
      expect(formatRating(undefined)).toBe('0.0');
    });
  });

  describe('formatVoteCount', () => {
    it('formats counts under 1000 directly', () => {
      expect(formatVoteCount(550)).toBe('550');
    });

    it('formats counts 1000 and above with K suffix', () => {
      expect(formatVoteCount(1200)).toBe('1.2K');
      expect(formatVoteCount(15400)).toBe('15.4K');
    });

    it('returns 0 for falsy input', () => {
      expect(formatVoteCount(0)).toBe('0');
      expect(formatVoteCount(null)).toBe('0');
    });
  });

  describe('titleCase', () => {
    it('converts text to title case', () => {
      expect(titleCase('hello world')).toBe('Hello World');
      expect(titleCase('ACTION MOVIE')).toBe('Action Movie');
    });

    it('handles empty input', () => {
      expect(titleCase('')).toBe('');
      expect(titleCase(null)).toBe('');
    });
  });

  describe('truncate', () => {
    it('truncates text beyond limit and appends ellipsis', () => {
      const longText =
        'The quick brown fox jumps over the lazy dog and runs away.';
      expect(truncate(longText, 20)).toBe('The quick brown fox…');
    });

    it('leaves shorter text unchanged', () => {
      expect(truncate('Short', 20)).toBe('Short');
    });
  });

  describe('getTitle & getReleaseDate', () => {
    it('gets title for movie', () => {
      expect(getTitle({title: 'Inception'})).toBe('Inception');
    });

    it('gets name for tv series', () => {
      expect(getTitle({name: 'Breaking Bad'})).toBe('Breaking Bad');
    });

    it('gets release_date for movie', () => {
      expect(getReleaseDate({release_date: '2010-07-16'})).toBe('2010-07-16');
    });

    it('gets first_air_date for tv series', () => {
      expect(getReleaseDate({first_air_date: '2008-01-20'})).toBe('2008-01-20');
    });
  });

  describe('getMediaTypeLabel', () => {
    it('returns correct readable labels', () => {
      expect(getMediaTypeLabel('movie')).toBe('Movie');
      expect(getMediaTypeLabel('tv')).toBe('TV Show');
      expect(getMediaTypeLabel('person')).toBe('Person');
      expect(getMediaTypeLabel('other')).toBe('Unknown');
    });
  });

  describe('clamp', () => {
    it('restricts values within range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(5, 0, 10)).toBe(5);
    });
  });

  describe('extractResults & extractTotalPages', () => {
    it('extracts results array safely', () => {
      const mockResponse = {data: {results: [{id: 1}, {id: 2}]}};
      expect(extractResults(mockResponse)).toHaveLength(2);
      expect(extractResults(null)).toEqual([]);
    });

    it('extracts total_pages safely', () => {
      expect(extractTotalPages({data: {total_pages: 50}})).toBe(50);
      expect(extractTotalPages(null)).toBe(1);
    });
  });

  describe('deduplicateById', () => {
    it('removes duplicate items with the same id', () => {
      const list = [
        {id: 1, name: 'A'},
        {id: 2, name: 'B'},
        {id: 1, name: 'Duplicate'},
      ];
      const result = deduplicateById(list);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('A');
      expect(result[1].name).toBe('B');
    });
  });

  describe('formatCurrency', () => {
    it('formats millions and billions', () => {
      expect(formatCurrency(250_000_000)).toBe('$250.0M');
      expect(formatCurrency(1_500_000_000)).toBe('$1.50B');
    });

    it('returns N/A when amount is 0 or null', () => {
      expect(formatCurrency(0)).toBe('N/A');
      expect(formatCurrency(null)).toBe('N/A');
    });
  });

  describe('getRatingColor', () => {
    it('returns green for >= 7, orange for >= 5, red otherwise', () => {
      expect(getRatingColor(8.2)).toBe('#4CAF50');
      expect(getRatingColor(6.4)).toBe('#FF9800');
      expect(getRatingColor(4.1)).toBe('#F44336');
    });
  });
});
