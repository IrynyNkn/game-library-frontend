import React from 'react';
import styles from '../../styles/pages/home/Card.module.scss';
import { useRouter } from 'next/router';
import { GameListType } from '../../utils/types/games';

type CardProps = {
  gameData: GameListType;
};

const Card = ({ gameData }: CardProps) => {
  const router = useRouter();

  return (
    <div
      className={styles.card}
      onClick={() => router.push(`/games/${gameData.id}`)}>
      <div className={styles.imgBox}>
        <img alt="game img" src={`${gameData.imageLink}`} />
      </div>
      <div className={styles.infoSection}>
        <p className={styles.name}>{gameData.title}</p>
        <div className={`${styles.info} ${styles.publisher}`}>
          <h4 className={styles.title}>Publisher:</h4>
          <p>{gameData.publisher.name}</p>
        </div>
        <div className={styles.info}>
          <h4 className={styles.title}>Genres:</h4>
          <ul className={styles.itemsList}>
            {gameData.genres.map((genre, idx) =>
              idx < 3 ? (
                idx < 2 ? (
                  <li key={idx} className={styles.chip}>
                    {genre.name}
                  </li>
                ) : (
                  <li key={idx} className={styles.chip}>+{gameData.genres.length - 2}</li>
                )
              ) : null
            )}
          </ul>
        </div>
        <div className={styles.info}>
          <h4 className={styles.title}>Platforms:</h4>
          <ul className={styles.itemsList}>
            {gameData.platforms.map((plt, idx) =>
              idx < 3 ? (
                idx < 2 ? (
                  <li key={idx} className={styles.chip}>
                    {plt.name}
                  </li>
                ) : (
                  <li key={idx} className={styles.chip}>
                    +{gameData.platforms.length - 2}
                  </li>
                )
              ) : null
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;
