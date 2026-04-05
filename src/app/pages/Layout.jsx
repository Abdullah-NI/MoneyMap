import { Outlet } from 'react-router-dom';
import { Layout as MainLayout } from '../components/Layout';

export const Layout = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};
