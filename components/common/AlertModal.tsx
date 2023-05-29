import React from 'react';
import Modal from 'react-modal';
import styles from '../../styles/components/AlertModal.module.scss';
import { DeleteModalType } from '../../utils/types/common';

type AlertModalProps = {
  modalIsOpen: DeleteModalType,
  closeModal: () => void,
  deleteItem: (id: string) => void
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: 0
  },
};

const AlertModal = ({modalIsOpen, closeModal, deleteItem}: AlertModalProps) => {
  const onDeleteClick = async () => {
    if(modalIsOpen.id && modalIsOpen.id !== '') {
      await deleteItem(modalIsOpen.id);
    } else {
      await deleteItem(undefined as never as string);
    }
    closeModal();
  };
  return (
    <div>
      <Modal
        isOpen={modalIsOpen.isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Delete Alert"
      >
        <div className={styles.headerWrap}>
          <h2 className={styles.title}>Delete Alert</h2>
        </div>
        <p className={styles.text}>Are you sure that you want to delete this item?</p>
        <div className={styles.buttons}>
          <button onClick={onDeleteClick} className={styles.deleteBtn}>Delete</button>
          <button onClick={closeModal} className={styles.cancelBtn}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default AlertModal;