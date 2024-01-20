import { Suspense } from 'react';
import FragmentLayout from '../layouts/Fragment';
import CheckoutPage from '../pages/CheckoutPage';
import ThankYouPage from '../pages/ThankYouPage';
import ErrorPage from '../pages/ErrorPage';
import AuthProtector from '../components/AuthProtector';

const salesRouter = [
  {
    path: '/sales',
    element: (
      <Suspense>
        <FragmentLayout />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'checkout',
        element: <AuthProtector allowedRoles={['Admin', 'Staff', 'User']} children={<CheckoutPage />} redirect="/auth" />,
      },
      {
        path: 'thanks/:orderId',
        element: <AuthProtector allowedRoles={['Admin', 'Staff', 'User']} children={<ThankYouPage />} redirect="/auth" />,
      },
    ],
  },
];

export default salesRouter;
