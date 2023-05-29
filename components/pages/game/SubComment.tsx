import React, { useMemo, useState } from 'react';
import styles from '/styles/pages/game/Comments.module.scss';
import UserBadge from '../../common/UserBadge';
import { BsSuitHeartFill } from 'react-icons/bs';
import { CommentType } from '../../../utils/types/games';
import { userRoles } from '../../../utils/consts';
import { toast } from 'react-toastify';
import { authTokenName } from '../../../utils/auth';
import useGame from '../../../utils/hooks/useGame';
import { useRouter } from 'next/router';
import getCookies from '../../../utils/getCookies';
import { MdDelete } from 'react-icons/md';
import useCurrentUser from '../../../utils/hooks/useCurrentUser';
import { formatDistanceToNow } from 'date-fns'
import AlertModal from '../../common/AlertModal';
import { DeleteModalType } from '../../../utils/types/common';
import { useLoading } from '../../../utils/hooks/useLoading';

type SubCommentPropsType = {
  isReply?: boolean;
  enableReply: () => void;
  commentData: CommentType | null;
  currentUserId: string;
};

const SubComment = ({
  isReply = false,
  enableReply,
  commentData,
  currentUserId,
}: SubCommentPropsType) => {
  const router = useRouter();
  const {setLoading} = useLoading();
  const { refetch } = useGame(router.query.id as string);
  const {data: currentUser} = useCurrentUser();
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState<DeleteModalType>({
    id: '',
    isOpen: false
  });

  const commentHasLike = useMemo<boolean>(() => {
    if (!commentData?.commentLikes || !currentUserId) {
      return false;
    }
    return !!commentData.commentLikes.find(
      (like) => like.userId === currentUserId
    );
  }, [commentData, currentUserId]);

  const likeComment = async () => {
    const reqBody = {
      userId: currentUserId,
      commentId: commentData?.id,
    };

    const accessToken = getCookies(authTokenName);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/likes`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify(reqBody),
      });
      const result = await response.json();

      if (result.statusCode === 401) {
        toast.error('You have to be authorized to like comments');
      } else if (!result.error) {
        await refetch();
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      console.log('Error while leaving a comment', e);
      toast.error('Something went wrong :(');
    }
  };

  const deleteLike = async () => {
    const likeId = commentData?.commentLikes.find(
      (like) => like.userId === currentUserId
    )?.id;
    const accessToken = getCookies(authTokenName);
    if (likeId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/likes/${likeId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          method: 'DELETE',
        });
        const result = await response.json();

        if (!result.error) {
          await refetch();
        } else if (result.statusCode === 401) {
          toast.error('You have to be authorized to like comments');
        } else {
          toast.error(result.message);
        }
      } catch (e) {
        console.log('Error while leaving a comment', e);
        toast.error('Something went wrong :(');
      }
    }
  };

  const deleteComment = async () => {
    const accessToken = getCookies(authTokenName);
    if(commentData?.id && showDeleteCommentBtn) {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments/${commentData.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          method: 'DELETE',
        });
        const result = await response.json();

        if (!result.error) {
          toast.success(result.message);
          await refetch();
        } else {
          toast.error(result.message);
        }
      } catch (e) {
        console.log('Error while leaving a comment', e);
        toast.error('Something went wrong :(');
      } finally {
        setLoading(false);
      }
    } else {
      toast.error('Access Forbidden');
    }
  }

  const onLikeClick = async () => {
    if (commentHasLike) {
      await deleteLike();
    } else {
      await likeComment();
    }
  };

  const showDeleteCommentBtn = currentUser?.role === userRoles.MANAGER || currentUser?.role === userRoles.ADMIN;

  return (
    <div className={styles.flexBox}>
      <UserBadge
        size={isReply ? 'small' : 'large'}
        badgeColor={commentData?.user?.badgeColor || '#49c5b6'}
      />
      <div className={styles.commentBody}>
        <div className={styles.userInfoBox}>
          <p className={styles.userName}>{commentData?.user?.userName}</p>
          <p className={styles.timeStamp}>
            {formatDistanceToNow(commentData?.createdAt ? new Date(commentData.createdAt) : new Date(), {addSuffix: true})}
          </p>
        </div>
        <p>
          {commentData?.replyUserMention && (
            <span className={styles.userMention}>
              @{commentData?.replyUserMention}
            </span>
          )}
          {commentData?.value}
        </p>
        <div className={styles.actionsPanel}>
          <button className={styles.replyBtn} onClick={enableReply}>
            Reply
          </button>
          <div
            className={`${styles.likeWrapper} ${
              commentHasLike ? styles.active : ''
            }`}
            onClick={onLikeClick}>
            <BsSuitHeartFill size={20} />
            <p className={styles.likesCount}>
              {commentData?.commentLikes?.length || ''}
            </p>
          </div>
          {
            showDeleteCommentBtn &&
            <button
              onClick={() => setDeleteCommentModalOpen({
                id: '',
                isOpen: true
              })}
              className={styles.deleteCommentBtn}>
              <span className={'delete-action'}>
                <MdDelete size={20} />
              </span>
            </button>
          }
        </div>
      </div>
      <AlertModal
        modalIsOpen={deleteCommentModalOpen}
        closeModal={() => setDeleteCommentModalOpen({
          id: '',
          isOpen: false
        })}
        deleteItem={deleteComment}
      />
    </div>
  );
};

export default SubComment;
