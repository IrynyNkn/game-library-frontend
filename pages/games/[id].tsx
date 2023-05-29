import React from 'react';
import styles from '/styles/pages/game/Game.module.scss';
import GameInfo from '../../components/pages/game/GameInfo';
import { GetServerSideProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { getGameById } from '../api/games';
import useGame from '../../utils/hooks/useGame';
import { useRouter } from 'next/router';
import { getCurrentUser } from '../api/users';

const GamePage = () => {
  const router = useRouter();
  const { data: gameData } = useGame(router.query.id as string);
  return (
    <div className={styles.gameWrapper}>
      <div className={styles.container}>
        <div className={styles.imageBox}>
          <img
            className={styles.gameImage}
            src={gameData?.imageLink}
            alt="game-pic"
          />
          {/*<GameRating*/}
          {/*  gameId={gameData?.id}*/}
          {/*  gameRatings={gameData?.ratings || []}*/}
          {/*/>*/}
        </div>
        <GameInfo />
      </div>
      <div className={styles.gameDescriptionWrapper}>
        <p className={styles.descriptionLabel}>Description</p>
        <p>{gameData?.description}</p>
      </div>
      {/*<Comments />*/}
    </div>
  );
};

export default GamePage;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const accessToken = req.cookies.GamelyAuthToken;
  const id = query.id;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['games', id], () =>
    getGameById(accessToken, id as string)
  );
  await queryClient.prefetchQuery(['me'], () => getCurrentUser(accessToken));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
