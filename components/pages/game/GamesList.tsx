import React from 'react';
import styles from '/styles/pages/home/Home.module.scss';
import Card from '../Card';
import { GameListType } from '../../../utils/types/games';

type GamesListPropsType = {
  games: GameListType[];
};

const GamesList = ({ games }: GamesListPropsType) => {
  return (
    <div className={styles.gamesList}>
      {games.map((game, idx) => (
        <Card gameData={game} key={idx} />
      ))}
    </div>
  );
};

export default GamesList;
