import React from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import styles from '../../styles/components/UserBadge.module.scss';

type UserBadgePropsType = {
  badgeColor: string;
  size?: 'large' | 'small';
};

const UserBadge = ({ badgeColor, size = 'large' }: UserBadgePropsType) => {
  return (
    <div
      style={{ backgroundColor: badgeColor }}
      className={`${styles.userBadgeCircle} ${styles[size]}`}>
      <AiOutlineUser size={size === 'large' ? 32 : 28} color="#FFFFFF" />
    </div>
  );
};

export default UserBadge;
