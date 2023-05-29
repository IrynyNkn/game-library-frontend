import React from 'react';
import styles from '/styles/layout/Logo.module.scss';

const Logo = () => {
  return (
    <div className={styles.logo}>
      <img
        className={styles.logoImg}
        src="/icons/gamepad.png"
        alt="Game console"
      />
      <div className={styles.logoTitle}>Gamely</div>
    </div>
  );
};

export default Logo;
