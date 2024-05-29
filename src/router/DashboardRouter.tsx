import { Suspense } from 'react';
import DashboardLayout from '../layouts/Dashboard';
import {
  DashboardPage,
  UsersDashboardPage,
  ProductsDashboardPage,
  OrdersDashboardPage,
  VouchersDashboardPage,
  CategoriesDashboardPage,
  OverallDashboardPage,
} from '../pages/DashboardPage';
import ErrorPage from '../pages/ErrorPage';
import AuthProtector from '../components/AuthProtector';
import StaffsDashboardPage from '../pages/DashboardPage/StaffsDashboardPage';
const dashboardRouter = [
  {
    path: '/dashboard',
    element: (
      <Suspense>
        <AuthProtector children={<DashboardLayout />} redirect="/auth" allowedRoles={['Admin', 'Staff']} />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersDashboardPage />,
      },
      {
        path: 'staffs',
        element: <AuthProtector children={<StaffsDashboardPage />} redirect="/auth" allowedRoles={['Admin']} />,
      },
      {
        path: 'products',
        element: <ProductsDashboardPage />,
      },
      {
        path: 'vouchers',
        element: <VouchersDashboardPage />,
      },
      {
        path: 'orders',
        element: <OrdersDashboardPage />,
      },
      {
        path: 'categories',
        element: <CategoriesDashboardPage />,
      },
      {
        path: 'overall',
        element: <OverallDashboardPage />,
      },
    ],
  },
];

export default dashboardRouter;
