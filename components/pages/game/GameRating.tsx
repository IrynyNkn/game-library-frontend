import React, { useEffect, useMemo, useState } from 'react';
import styles from '/styles/pages/game/GameRating.module.scss';
import { AiFillStar } from 'react-icons/ai';
import { authTokenName } from '../../../utils/auth';
import { toast } from 'react-toastify';
import { RatingType } from '../../../utils/types/games';
import getCookies from '../../../utils/getCookies';
import useGame from '../../../utils/hooks/useGame';
import useCurrentUser from '../../../utils/hooks/useCurrentUser';

type GameRatingProps = {
  gameId: string | undefined;
  gameRatings: RatingType[];
};

const GameRating = ({
  gameId,
  gameRatings,
}: GameRatingProps) => {
  const unRatedArr = [false, false, false, false, false];
  const [ratingScore, setRatingScore] = useState<number | null>(null);
  const [stars, setStars] = useState<boolean[]>(unRatedArr);
  const {refetch} = useGame(gameId || '');
  const { data: currentUser } = useCurrentUser();

  const currentUserRating = useMemo<RatingType | null>(() => {
    const currentRate = gameRatings.find(
      (rate) => rate.userId === currentUser?.id
    );
    return currentRate || null;
  }, [gameRatings, currentUser]);

  useEffect(() => {
    if (currentUserRating) {
      setRatingScore(currentUserRating.value);
      setStars(initializeStars(currentUserRating.value));
    }
  }, [currentUserRating]);

  const initializeStars = (score: number) => {
    return [...unRatedArr].map((str, idx) => idx + 1 <= score);
  };

  const handleHover = (id: number) => {
    const starsArr = [...stars];
    stars.forEach((star, idx) => {
      if (idx <= id) {
        starsArr[idx] = true;
      }
    });
    setStars(starsArr);
  };

  const makeRateRequest = async (score: number) => {
    const reqBody: any = {
      userId: currentUser?.id,
      gameId: gameId,
      value: score,
      ratingId: null,
    };

    if (currentUserRating) {
      reqBody.ratingId = currentUserRating.id;
    }

    const accessToken = getCookies(authTokenName);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/games/rate`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify(reqBody),
      });
      const result = await response.json();

      if (!result.error) {
        await refetch();
        toast.success('You successfully rated game');
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      console.log('Error while rating a game', e);
      toast.error('Something went wrong :(');
    }
  };

  const setScore = async (score: number) => {
    if(!currentUser?.id) {
      toast.error('You need to authorize first');
      return;
    }

    setRatingScore(score + 1);
    await makeRateRequest(score + 1);
  };

  return (
    <div className={styles.ratingBox}>
      {stars.map((star, idx) => (
        <span
          key={idx}
          className={`${styles.iconWrapper} ${
            stars[idx] || (ratingScore && idx < ratingScore)
              ? styles.active
              : ''
          }`}
          onMouseEnter={() => handleHover(idx)}
          onMouseLeave={() => setStars(unRatedArr)}
          onClick={() => setScore(idx)}>
          <AiFillStar size={32} />
        </span>
      ))}
    </div>
  );
};

export default GameRating;
