import React, { useEffect, useRef, useState } from 'react';
import styles from '/styles/pages/game/Reply.module.scss';
import UserBadge from '../../common/UserBadge';
import { authTokenName } from '../../../utils/auth';
import { toast } from 'react-toastify';
import { CommentPostDto, ReplyDataType } from '../../../utils/types/games';
import { useLoading } from '../../../utils/hooks/useLoading';
import useGame from '../../../utils/hooks/useGame';
import { useRouter } from 'next/router';
import getCookies from '../../../utils/getCookies';
import useCurrentUser from '../../../utils/hooks/useCurrentUser';

type ReplyPropsType = {
  isReply?: boolean;
  close?: () => void;
  parentReplyOwner?: string;
  userId?: string;
  replyDataType?: ReplyDataType;
};

const Reply = ({
  isReply = false,
  parentReplyOwner,
  close,
  userId,
  replyDataType,
}: ReplyPropsType) => {
  const router = useRouter();
  const { data: gameData, refetch } = useGame(router.query.id as string);
  const ref = useRef<any>(null);
  const parentReplyOwnerRef = useRef<any>(null);
  const [showButtons, setShowButtons] = useState<boolean>(isReply);
  const [showInput, setShowInput] = useState<boolean>(false);
  const isNested = !!parentReplyOwner;
  const { setLoading } = useLoading();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    if (isReply) {
      ref?.current?.focus();
    }
  }, []);

  useEffect(() => {
    setShowInput(true);
  }, [parentReplyOwnerRef?.current]);

  useEffect(() => {
    if (isReply && parentReplyOwner) {
      ref?.current?.focus();
    }
  }, [showInput]);

  const cancelComment = () => {
    ref.current.textContent = '';
    if (isReply && close) {
      close();
    } else {
      setShowButtons(false);
    }
  };

  const leaveComment = async (
    commentValue: string,
    accessToken: string | undefined,
    reqBody: CommentPostDto
  ) => {
    if(reqBody.value.trim().length === 0) {
      toast.error(`Your comment can't be empty`);
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/comments`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify(reqBody),
      });
      const result = await response.json();

      if (result.error) {
        toast.error(result.message);
      } else if(result.statusCode === 401) {
        toast.error('You need to be authorized to leave a comment');
      } else {
        toast.success(result.message);
        ref.current.textContent = '';
        await refetch();
      }
    } catch (e) {
      console.log('Error while leaving a comment', e);
      toast.error('Something went wrong :(');
    } finally {
      if(close) {
        close();
      }
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: window.innerHeight + 400,
      behavior: 'smooth'
    });
  };

  const submit = async () => {
    const commentValue = ref?.current?.textContent || '';
    const accessToken = getCookies(authTokenName);

    setLoading(true);
    if (!isReply) {
      const reqBody = {
        userId,
        gameId: gameData?.id,
        value: commentValue,
        parentId: null,
      };
      await leaveComment(commentValue, accessToken, reqBody as CommentPostDto);
      setTimeout(() => scrollToBottom(), 0);
    } else if (isReply && !parentReplyOwner) {
      const reqBody = {
        userId,
        gameId: replyDataType?.gameDataId,
        value: commentValue,
        parentId: replyDataType?.parentId,
      };
      await leaveComment(commentValue, accessToken, reqBody as CommentPostDto);
    } else {
      const reqBody = {
        userId,
        gameId: replyDataType?.gameDataId,
        value: commentValue,
        parentId: replyDataType?.parentId,
        replyUserMention: parentReplyOwner,
      };
      await leaveComment(commentValue, accessToken, reqBody as CommentPostDto);
    }
    setShowButtons(false);
    setLoading(false);
  };

  return (
    <div className={styles.replyBox}>
      <UserBadge size={isReply ? 'small' : 'large'} badgeColor={currentUser?.badgeColor ?? '#9cadce'} />
      <div className={styles.commentContainer}>
        {isNested && (
          <span className={styles.parentReplyOwner} ref={parentReplyOwnerRef}>
            @{parentReplyOwner}
          </span>
        )}
        {(!parentReplyOwner || showInput) && (
          <div
            ref={ref}
            contentEditable
            placeholder={'Add a comment...'}
            className={styles.commentInput}
            onFocus={() => setShowButtons(true)}
            style={{
              paddingLeft: isNested
                ? parentReplyOwnerRef?.current?.offsetWidth + 6
                : 0,
            }}
          />
        )}
        <div className={styles.btnsWrapper}>
          {showButtons && (
            <>
              <button className={styles.commentBtn} onClick={submit}>
                Comment
              </button>
              <button onClick={cancelComment} className={styles.cancelBtn}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reply;
