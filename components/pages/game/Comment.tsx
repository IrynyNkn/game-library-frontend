import React, { useMemo, useState } from 'react';
import styles from '/styles/pages/game/Comments.module.scss';
import Reply from './Reply';
import SubComment from './SubComment';
import { CommentType, ReplyDataType } from '../../../utils/types/games';
import useCurrentUser from '../../../utils/hooks/useCurrentUser';

type CommentProps = {
  commentData: CommentType | null;
  comments: CommentType[];
  // currentUser: UserType | null
};

type NestedReplyType = ReplyDataType & {
  enableNestedReply: boolean;
  mentionedUser?: string;
};

const Comment = ({ commentData, comments }: CommentProps) => {
  const { data: currentUser } = useCurrentUser();
  const [showAllReplies, setShowAllReplies] = useState();
  const [enableReply, setEnableReply] = useState<NestedReplyType>({
    gameDataId: '',
    parentId: null,
    enableNestedReply: false,
  });
  const [enableNestedReply, setEnableNestedReply] = useState<NestedReplyType>({
    gameDataId: '',
    parentId: null,
    enableNestedReply: false,
  });

  const nestedComments = useMemo(() => {
    return comments.filter((cmt) => cmt?.parentId === commentData?.id);
  }, [comments, commentData]);

  return (
    <div>
      {commentData && !commentData?.parentId && (
        <SubComment
          commentData={commentData}
          enableReply={() =>
            setEnableReply({
              gameDataId: commentData.gameId,
              parentId: commentData.id,
              enableNestedReply: true,
            })
          }
          currentUserId={currentUser?.id || ''}
        />
      )}
      <div className={styles.replies}>
        {enableReply.enableNestedReply && (
          <Reply
            isReply={true}
            close={() =>
              setEnableReply({
                ...enableReply,
                enableNestedReply: false,
              })
            }
            replyDataType={{
              gameDataId: enableReply.gameDataId,
              parentId: enableReply.parentId,
            }}
            userId={currentUser?.id}
          />
        )}
        {nestedComments?.length
          ? nestedComments.map((cmt, idx) => (
              <div key={idx} className={styles.nestedCommentBox}>
                <SubComment
                  commentData={cmt}
                  enableReply={() =>
                    setEnableNestedReply({
                      gameDataId: cmt.gameId,
                      parentId: cmt.parentId,
                      enableNestedReply: true,
                      mentionedUser: cmt.user.userName,
                    })
                  }
                  isReply={true}
                  currentUserId={currentUser?.id || ''}
                />
              </div>
            ))
          : null}
        {enableNestedReply.enableNestedReply && (
          <Reply
            isReply={true}
            parentReplyOwner={enableNestedReply.mentionedUser}
            close={() =>
              setEnableNestedReply({
                ...enableNestedReply,
                enableNestedReply: false,
              })
            }
            replyDataType={{
              gameDataId: enableNestedReply.gameDataId,
              parentId: enableNestedReply.parentId,
            }}
            userId={currentUser?.id}
          />
        )}
      </div>
    </div>
  );
};

export default Comment;
