import React, { useState } from 'react';
import styles from '/styles/pages/games-management/GamesManagement.module.scss';
import { GetServerSideProps } from 'next';
import { PublisherType } from '../../utils/types/games';
import { useRouter } from 'next/router';
import Table from '../../components/common/Table';
import { toast } from 'react-toastify';
import { useLoading } from '../../utils/hooks/useLoading';
import { DeleteModalType } from '../../utils/types/common';
import AlertModal from '../../components/common/AlertModal';

type PublishersType = {
  publishers: PublisherType[];
};

const Publishers = ({ publishers }: PublishersType) => {
  const router = useRouter();
  const {setLoading} = useLoading();
  const [publishersList, setPublishersList] =
    useState<PublisherType[]>(publishers);
  const [deleteGameModalOpen, setDeleteGameModalOpen] = useState<DeleteModalType>({
    id: '',
    isOpen: false
  });

  const tableHead = ['#', 'Name', 'Actions'];

  const deletePublisher = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/publishers/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!result.error) {
        toast.success(result.message);
        setPublishersList(
          [...publishersList].filter((publisher) => publisher.id !== id)
        );
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  const cellRenderMethods = {
    onEditClick: (id: string) =>
      router.push({
        pathname: '/games-management/fields/add',
        query: {
          fieldType: 'publishers',
          fieldId: id,
        },
      }),
    onDeleteClick: (id: string) => setDeleteGameModalOpen({id, isOpen: true}),
  };

  return (
    <div className={`${styles.container} wrapper`}>
      <div className={styles.headerBox}>
        <h1 className={styles.title}>Publishers List</h1>
        <button
          className={'green-button'}
          onClick={() =>
            router.push({
              pathname: '/games-management/fields/add',
              query: {
                fieldType: 'publishers',
              },
            })
          }>
          Add Publisher
        </button>
      </div>
      <Table
        tableHead={tableHead}
        tableBody={publishersList}
        cellRenderMethods={cellRenderMethods}
      />
      <AlertModal
        modalIsOpen={deleteGameModalOpen}
        closeModal={() => setDeleteGameModalOpen({
          id: '',
          isOpen: false
        })}
        deleteItem={deletePublisher}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let publishers = [];

  try {
    const accessToken = req.cookies.GamelyAuthToken;

    const resPublishers = await fetch(`${process.env.API_URL}/publishers`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });
    publishers = await resPublishers.json();
  } catch (e) {
    console.log('Error while fetching genres', e);
  }

  return {
    props: {
      publishers: publishers?.data ?? [],
    },
  };
};

export default Publishers;
