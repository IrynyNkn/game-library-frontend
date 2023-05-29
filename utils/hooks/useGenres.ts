import { useQuery } from 'react-query';
import { GenreType } from '../types/games';

const useGenres = () => {
  const genresQuery = useQuery<GenreType[]>('genres', () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/genres`).then((res) => res.json())
  );

  return {
    ...genresQuery,
    // @ts-ignore
    data: genresQuery.data?.error || genresQuery?.error ? [] : genresQuery.data?.data as GenreType[],
  };
};

export default useGenres;
