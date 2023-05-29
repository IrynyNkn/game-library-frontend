import React from 'react';
import styles from '../../styles/components/Table.module.scss';
import { BiSearchAlt } from 'react-icons/bi';

type SearchBarPropsType = {
  searchQuery: string;
  setSearchQuery: (val: string) => void,
  mainScreen?: boolean,
  clickSearchBtn?: () => void
}

const SearchBar = ({searchQuery, setSearchQuery, mainScreen = false, clickSearchBtn}: SearchBarPropsType) => {
  return (
    <label className={`input-container ${styles.inputLabel} ${mainScreen ? '' : styles.withOffset}`}>
      {
        !mainScreen && <BiSearchAlt size={20} className={styles.searchIcon} />
      }
      <input
        className={`input ${styles.input} ${styles.inputMain}`}
        value={searchQuery}
        placeholder={mainScreen ? 'Search by name' : ''}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {
        mainScreen && clickSearchBtn &&
        <button onClick={clickSearchBtn} className={styles.searchBtn}>
          <BiSearchAlt size={22} className={styles.searchIcon} />
        </button>
      }
    </label>
  );
};

export default SearchBar;