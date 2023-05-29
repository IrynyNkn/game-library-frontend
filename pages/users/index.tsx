import React, { useMemo, useState } from 'react';
import styles from '/styles/pages/games-management/GamesManagement.module.scss';
import Table from '../../components/common/Table';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { UserType } from '../../utils/types/users';
import { CellRenderMethodsType } from '../../utils/types/games';
import { toast } from 'react-toastify';
import { useLoading } from '../../utils/hooks/useLoading';
import { DeleteModalType } from '../../utils/types/common';
import AlertModal from '../../components/common/AlertModal';

type UsersPageType = {
  users: UserType[];
};

const UsersPage = ({ users }: UsersPageType) => {
  const router = useRouter();
  const {setLoading} = useLoading();
  const [usersList, setUsersList] = useState<UserType[]>(users);
  const [deleteGameModalOpen, setDeleteGameModalOpen] = useState<DeleteModalType>({
    id: '',
    isOpen: false
  });

  const tableHead = ['#', 'Username', 'Email', 'Roles', 'Actions'];

  const tableBody = useMemo(() => {
    return usersList.map((user) => ({
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    }));
  }, [usersList]);

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!result.error) {
        toast.success(result.message);
        setUsersList([...usersList].filter((user) => user.id !== id));
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
    renderCell: {
      roles: (roles: string[]) =>
        roles.map((role, idx) => (
          <span className={styles.chip} key={idx}>
            {role}
          </span>
        )),
    },
    onEditClick: (id: string) => router.push(`/users/edit/${id}`),
    onDeleteClick: (id: string) => setDeleteGameModalOpen({id, isOpen: true}),
  };

  return (
    <div className={`${styles.container} wrapper`}>
      <h1 className={styles.title}>Users</h1>
      <Table
        tableHead={tableHead}
        tableBody={tableBody}
        cellRenderMethods={cellRenderMethods as CellRenderMethodsType}
      />
      <AlertModal
        modalIsOpen={deleteGameModalOpen}
        closeModal={() => setDeleteGameModalOpen({
          id: '',
          isOpen: false
        })}
        deleteItem={deleteUser}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let users = [];

  try {
    const accessToken = req.cookies.GamelyAuthToken;

    const resUsers = await fetch(`${process.env.API_URL}/users`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });
    const result = await resUsers.json();

    if(!result.error && result.statusCode !== 500 && result.data) {
      users = result.data;
    }
  } catch (e) {
    console.log('Error while fetching users', e);
  }

  return {
    props: {
      users,
    },
  };
};

export default UsersPage;
