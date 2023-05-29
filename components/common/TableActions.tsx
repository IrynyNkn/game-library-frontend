import React from 'react';
import styles from '../../styles/components/Table.module.scss';
import { RiEditFill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';

type TableActionsType = {
  onEditClick: () => void;
  onDeleteClick: () => void;
};

const TableActions = ({ onEditClick, onDeleteClick }: TableActionsType) => {
  return (
    <>
      <button onClick={onEditClick} className={styles.tableActionsBtn}>
        <span className={styles.editAction}>
          <RiEditFill size={20} />
        </span>
      </button>
      <button onClick={onDeleteClick} className={styles.tableActionsBtn}>
        <span className={'delete-action'}>
          <MdDelete size={20} />
        </span>
      </button>
    </>
  );
};

export default TableActions;
