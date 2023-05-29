import React, { useState } from 'react';
import styles from '/styles/pages/games-management/GamesManagement.module.scss';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import {
  GenreType,
} from '../../utils/types/games';
import Table from '../../components/common/Table';
import { toast } from 'react-toastify';
import { useLoading } from '../../utils/hooks/useLoading';
import { DeleteModalType } from '../../utils/types/common';
import AlertModal from '../../components/common/AlertModal';

type GenresType = {
  genres: GenreType[];
};

const Genres = ({ genres }: GenresType) => {
  const router = useRouter();
  const [genresList, setGenresList] = useState<GenreType[]>(genres);
  const {setLoading} = useLoading();
  const [deleteGameModalOpen, setDeleteGameModalOpen] = useState<DeleteModalType>({
    id: '',
    isOpen: false
  });

  const tableHead = ['#', 'Name', 'Actions'];

  const deleteGenre = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/genres/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!result.error) {
        toast.success(result.message);
        setGenresList([...genresList].filter((genre) => genre.id !== id));
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
          fieldType: 'genres',
          fieldId: id,
        },
      }),
    onDeleteClick: (id: string) => setDeleteGameModalOpen({id, isOpen: true}),
    // onDeleteClick: (id: string) => deleteGenre(id),
  };

  return (
    <div className={`${styles.container} wrapper`}>
      <div className={styles.headerBox}>
        <h1 className={styles.title}>Genres List</h1>
        <button
          className={'green-button'}
          onClick={() =>
            router.push({
              pathname: '/games-management/fields/add',
              query: {
                fieldType: 'genres',
              },
            })
          }>
          Add Genre
        </button>
      </div>
      <Table
        tableHead={tableHead}
        tableBody={genresList}
        cellRenderMethods={cellRenderMethods}
      />
      <AlertModal
        modalIsOpen={deleteGameModalOpen}
        closeModal={() => setDeleteGameModalOpen({
          id: '',
          isOpen: false
        })}
        deleteItem={deleteGenre}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let genres = [];

  try {
    const accessToken = req.cookies.GamelyAuthToken;

    const resGenres = await fetch(`${process.env.API_URL}/genres`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });
    genres = await resGenres.json();
  } catch (e) {
    console.log('Error while fetching genres', e);
  }
  console.log('genres', genres)
  return {
    props: {
      genres: genres?.data ?? [],
    },
  };
};

export default Genres;
