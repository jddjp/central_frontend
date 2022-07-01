import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, Outlet } from 'react-router-dom';

import theme from '../src/theme';
import '../src/theme/styles.css';

import { RequiredAuthentication } from 'components/RequiredAuthentication';
import { HomePage } from 'pages/core/Home';

import WelcomenPage from 'pages/auth/WelcomenPage';
import LoginPage from 'pages/auth/LoginPage';
import DashboardPage from 'pages/core/DashboardPage';
import CreateOrderPage from 'pages/orders/CreateOrderPage';
import { RequiredAnonymous } from 'components/RequiredAnonymous';
import { CenterLayout } from 'pages/layouts/CenterLayout';
import { MainLayout } from 'pages/layouts/MainLayout';
import { useAuthInterceptors } from 'hooks/useAuthInterceptors';
import { ListExistedOrdersPage } from 'pages/orders/ListExistedOrdersPage';
import { SalesHistoryPage } from 'pages/sales/SalesHistoryPage.tsx';
import CataloguePage from 'pages/articles/CataloguePage';
import TypeNote from 'pages/payments/TypeNote';
import TypeInvoices from 'pages/payments/invoice/TypeInvoices';
import NewClient from 'pages/payments/invoice/NewClient';
import ExistingClient from 'pages/payments/invoice/ExistingClient';
import Articulos from 'pages/articles/articulos';

export const App = () => {
  useAuthInterceptors();

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route
          element={
            <CenterLayout>
              <Outlet />
            </CenterLayout>
          }
        >
          <Route
            path="/"
            element={
              <RequiredAnonymous>
                <HomePage />
              </RequiredAnonymous>
            }
          />
          <Route
            path="/login"
            element={
              <RequiredAnonymous>
                <LoginPage />
              </RequiredAnonymous>
            }
          />
          <Route
            path="/login/welcomen"
            element={
              <RequiredAuthentication>
                <WelcomenPage />
              </RequiredAuthentication>
            }
          />
        </Route>

        <Route
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          <Route
            path="/dashboard"
            element={
              <RequiredAuthentication>
                <DashboardPage />
              </RequiredAuthentication>
            }
          />
          <Route
            path="/orders/new"
            element={
              <RequiredAuthentication>
                <CreateOrderPage />
              </RequiredAuthentication>
            }
          />
          <Route
            path="/orders"
            element={
              <RequiredAuthentication>
                <ListExistedOrdersPage />
              </RequiredAuthentication>
            }
          />
          <Route
            path="/orders/typeNote"
            element={
              <RequiredAuthentication>
                <TypeNote />
              </RequiredAuthentication>
            }
          />
          <Route
            path="/orders/typeInvoice"
            element={
              <RequiredAuthentication>
                <TypeInvoices />
              </RequiredAuthentication>
            }
          />
          <Route
            path="/orders/typeInvoice/newCliente"
            element={
              <RequiredAuthentication>
                <NewClient />
              </RequiredAuthentication>
            }
          />
          <Route
            path="/orders/typeInvoice/ExistingClient"
            element={
              <RequiredAuthentication>
                <ExistingClient />
              </RequiredAuthentication>
            }
          />
          <Route
            path="/sales"
            element={
              <RequiredAuthentication>
                <SalesHistoryPage />
              </RequiredAuthentication>
            }
          />
          <Route
            path="/catalogue"
            element={
              <RequiredAuthentication>
                <CataloguePage />
              </RequiredAuthentication>
            }
          />



        </Route>

        
    


      </Routes>
    </ChakraProvider>
  );
};
