import React, { useState } from 'react';
import Header from './Header';
import styles from '../../styles/layout/Layout.module.scss';
import Sidebar from './Sidebar';
import { useLoading } from '../../utils/hooks/useLoading';
import Loader from './Loader';

type LayoutPropsType = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutPropsType) => {
  const [sideBarIsOpen, setSidebarOpen] = useState<boolean>(false);
  const { loading } = useLoading();

  return (
    <>
      <Header sideBarIsOpen={sideBarIsOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar
        sideBarIsOpen={sideBarIsOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />
      <main className={styles.main}>
        <Loader />
        <div className={styles.placeholder} />
        <div className={styles.content}>{children}</div>
      </main>
    </>
  );
};

export default Layout;
