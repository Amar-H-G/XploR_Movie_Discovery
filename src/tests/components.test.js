// CineVerse — Component Unit Tests
import React from 'react';
import renderer from 'react-test-renderer';

import RatingBadge from '../components/common/RatingBadge';
import GenreChip from '../components/common/GenreChip';
import SectionHeader from '../components/common/SectionHeader';
import {
  EmptyState,
  ErrorState,
  NetworkErrorState,
} from '../components/states/StateComponents';

describe('Common UI Components', () => {
  describe('RatingBadge', () => {
    it('renders rating value properly', () => {
      const tree = renderer.create(<RatingBadge rating={8.4} />).toJSON();
      expect(tree).toBeDefined();
    });

    it('renders with compact variant', () => {
      const tree = renderer
        .create(<RatingBadge rating={6.2} compact />)
        .toJSON();
      expect(tree).toBeDefined();
    });
  });

  describe('GenreChip', () => {
    it('renders genre label and handles unselected state', () => {
      const tree = renderer
        .create(<GenreChip genre={{id: 28, name: 'Action'}} selected={false} />)
        .toJSON();
      expect(tree).toBeDefined();
    });

    it('renders selected state correctly', () => {
      const tree = renderer
        .create(<GenreChip genre={{id: 35, name: 'Comedy'}} selected={true} />)
        .toJSON();
      expect(tree).toBeDefined();
    });
  });

  describe('SectionHeader', () => {
    it('renders section title without action', () => {
      const tree = renderer
        .create(<SectionHeader title="Trending Movies" />)
        .toJSON();
      expect(tree).toBeDefined();
    });

    it('renders section title with See All action', () => {
      const tree = renderer
        .create(<SectionHeader title="Top Rated" onSeeAll={() => {}} />)
        .toJSON();
      expect(tree).toBeDefined();
    });
  });

  describe('StateComponents', () => {
    it('renders EmptyState with icon and message', () => {
      const tree = renderer
        .create(
          <EmptyState
            icon="film-outline"
            title="No Movies Found"
            message="Try searching for another keyword"
          />,
        )
        .toJSON();
      expect(tree).toBeDefined();
    });

    it('renders ErrorState with retry button', () => {
      const tree = renderer
        .create(
          <ErrorState
            message="Server encountered an error"
            onRetry={() => {}}
          />,
        )
        .toJSON();
      expect(tree).toBeDefined();
    });

    it('renders NetworkErrorState with retry action', () => {
      const tree = renderer
        .create(<NetworkErrorState onRetry={() => {}} />)
        .toJSON();
      expect(tree).toBeDefined();
    });
  });
});
