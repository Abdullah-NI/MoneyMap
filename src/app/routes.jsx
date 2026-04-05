import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'transactions', Component: Transactions },
      { path: 'insights', Component: Insights },
      { path: 'settings', Component: Settings },
      { path: '*', Component: NotFound },
    ],
  },
]);
