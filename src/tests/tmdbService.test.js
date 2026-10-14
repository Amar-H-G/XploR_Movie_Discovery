// CineVerse — TMDB Service Unit Tests
import axiosClient from '../api/axiosClient';
import * as tmdbService from '../api/tmdbService';

jest.mock('../api/axiosClient');

describe('TMDB Service Integration Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getTrendingMovies calls correct endpoint', async () => {
    axiosClient.get.mockResolvedValueOnce({
      data: {results: [{id: 1, title: 'Trending 1'}]},
    });
    const res = await tmdbService.getTrendingMovies();
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/trending/movie/day',
      expect.objectContaining({
        params: expect.objectContaining({language: 'en-US'}),
      }),
    );
    expect(res.data.results[0].title).toBe('Trending 1');
  });

  it('getPopularMovies calls /movie/popular with pagination', async () => {
    axiosClient.get.mockResolvedValueOnce({data: {page: 2, results: []}});
    await tmdbService.getPopularMovies(2);
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/movie/popular',
      expect.objectContaining({params: expect.objectContaining({page: 2})}),
    );
  });

  it('getMovieDetails calls /movie/{id}', async () => {
    axiosClient.get.mockResolvedValueOnce({
      data: {id: 550, title: 'Fight Club'},
    });
    const res = await tmdbService.getMovieDetails(550);
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/movie/550',
      expect.any(Object),
    );
    expect(res.data.title).toBe('Fight Club');
  });

  it('getMovieCredits calls /movie/{id}/credits', async () => {
    axiosClient.get.mockResolvedValueOnce({data: {id: 550, cast: []}});
    await tmdbService.getMovieCredits(550);
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/movie/550/credits',
      expect.any(Object),
    );
  });

  it('getMovieVideos calls /movie/{id}/videos', async () => {
    axiosClient.get.mockResolvedValueOnce({data: {id: 550, results: []}});
    await tmdbService.getMovieVideos(550);
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/movie/550/videos',
      expect.any(Object),
    );
  });

  it('searchMovies passes query string properly', async () => {
    axiosClient.get.mockResolvedValueOnce({data: {results: []}});
    await tmdbService.searchMovies('Dune', 1);
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/search/movie',
      expect.objectContaining({
        params: expect.objectContaining({
          query: 'Dune',
          page: 1,
          include_adult: false,
        }),
      }),
    );
  });

  it('getTVDetails calls /tv/{id}', async () => {
    axiosClient.get.mockResolvedValueOnce({
      data: {id: 1399, name: 'Game of Thrones'},
    });
    const res = await tmdbService.getTVDetails(1399);
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/tv/1399',
      expect.any(Object),
    );
    expect(res.data.name).toBe('Game of Thrones');
  });

  it('getMovieGenres calls /genre/movie/list', async () => {
    axiosClient.get.mockResolvedValueOnce({
      data: {genres: [{id: 28, name: 'Action'}]},
    });
    const res = await tmdbService.getMovieGenres();
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/genre/movie/list',
      expect.any(Object),
    );
    expect(res.data.genres[0].name).toBe('Action');
  });

  it('discoverMovies passes sort and genre filters', async () => {
    axiosClient.get.mockResolvedValueOnce({data: {results: []}});
    await tmdbService.discoverMovies({with_genres: '28'});
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/discover/movie',
      expect.objectContaining({
        params: expect.objectContaining({
          sort_by: 'popularity.desc',
          with_genres: '28',
        }),
      }),
    );
  });

  it('getPersonDetails calls /person/{id}', async () => {
    axiosClient.get.mockResolvedValueOnce({data: {id: 287, name: 'Brad Pitt'}});
    const res = await tmdbService.getPersonDetails(287);
    expect(axiosClient.get).toHaveBeenCalledWith(
      '/person/287',
      expect.any(Object),
    );
    expect(res.data.name).toBe('Brad Pitt');
  });
});
