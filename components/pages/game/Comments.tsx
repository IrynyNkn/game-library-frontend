import React, { useMemo } from 'react';
import styles from '/styles/pages/game/Comments.module.scss';
import Comment from './Comment';
import Reply from './Reply';
import { useRouter } from 'next/router';
import useGame from '../../../utils/hooks/useGame';
import useCurrentUser from '../../../utils/hooks/useCurrentUser';

const Comments = () => {
  const router = useRouter();
  const { data: gameData } = useGame(router.query.id as string);
  const { data: currentUser } = useCurrentUser();

  const comments = useMemo(() => gameData?.comments || [], [gameData]);

  return (
    <div className={styles.commentsBox}>
      <h2 className={styles.title}>Discussion</h2>
      <Reply userId={currentUser?.id} />
      {comments.map((cmt, idx) => (
        <Comment key={idx} comments={comments} commentData={cmt} />
      ))}
    </div>
  );
};

export default Comments;
