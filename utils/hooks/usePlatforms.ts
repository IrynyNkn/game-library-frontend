import { useQuery } from 'react-query';
import { PlatformsType } from '../types/games';

const usePlatforms = () => {
  const platformsQuery = useQuery<PlatformsType[]>('platforms', () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/platforms`).then((res) => res.json())
  );

  return {
    ...platformsQuery,
    // @ts-ignore
    data: platformsQuery.data?.error || platformsQuery?.error ? [] : platformsQuery.data?.data as PlatformsType[],
  };
};

export default usePlatforms;
