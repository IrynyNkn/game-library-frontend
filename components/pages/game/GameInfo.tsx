import React from 'react';
import styles from '/styles/pages/game/GameInfo.module.scss';
import { useRouter } from 'next/router';
import useGame from '../../../utils/hooks/useGame';
import { AiFillStar } from 'react-icons/ai';

const GameInfo = () => {
  const router = useRouter();
  const { data: gameData } = useGame(router.query.id as string);

  return (
    <div className={styles.container}>
      <div className={styles.gameHeader}>
        {!!gameData?.gameRating && (
          <span className={styles.ratingBox}>
            <AiFillStar className={styles.ratingStar} size={74} />
            <span className={styles.ratingVal}>{gameData.gameRating}</span>
          </span>
        )}
        <h1 className={styles.gameTitle}>{gameData?.title}</h1>
      </div>
      <dl className={styles.description}>
        <dt className={styles.label}>Genre</dt>
        <dd className={`${styles.data} ${styles.dataBox}`}>
          {gameData?.genres ? (
            gameData.genres.map((genre, idx) => (
              <div
                key={idx}
                className={styles.tag}>
                {genre.name}
              </div>
            ))
          ) : (
            <div>--</div>
          )}
        </dd>
        <dt className={styles.label}>Publisher</dt>
        <dd className={`${styles.data} ${styles.dataBox}`}>
          <div
            className={styles.tag}>
            {gameData?.publisher?.name}
          </div>
        </dd>
        <dt className={styles.label}>Platforms</dt>
        <dd className={`${styles.data} ${styles.dataBox}`}>
          {gameData?.platforms ? (
            gameData.platforms.map((plt, idx) => (
              <div
                key={idx}
                className={styles.tag}>
                {plt.name}
              </div>
            ))
          ) : (
            <div>--</div>
          )}
        </dd>
        <dt className={styles.label}>Release Year</dt>
        <dd className={`${styles.data} ${styles.value}`}>
          {gameData?.releaseYear}
        </dd>
        <dt className={styles.label}>Age Restrictions</dt>
        <dd className={styles.data}>
          <span className={styles.ageBox}>{gameData?.ageRestriction}+</span>
        </dd>
      </dl>
    </div>
  );
};

export default GameInfo;
