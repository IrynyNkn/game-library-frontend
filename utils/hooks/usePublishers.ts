import { useQuery } from 'react-query';
import { PublisherType } from '../types/games';

const usePublishers = () => {
  const publishersQuery = useQuery<PublisherType[]>('publishers', () =>
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/publishers`).then((res) => res.json())
  );

  return {
    ...publishersQuery,
    // @ts-ignore
    data: publishersQuery.data?.error || publishersQuery?.error ? [] : publishersQuery.data?.data as PublisherType[],
  };
};

export default usePublishers;
