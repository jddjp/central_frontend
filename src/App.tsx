import { ChakraProvider } from '@chakra-ui/react';
import { Routes, Route, Outlet } from 'react-router-dom';

import theme from '../src/theme';
import '../src/theme/styles.css';

import { RequiredAuthentication } from 'components/RequiredAuthentication';
import HomePage from 'pages/core/Home';
import WelcomenPage from 'pages/auth/WelcomenPage';
import LoginPage from 'pages/auth/LoginPage';
import DashboardPage from 'pages/core/DashboardPage';
import CreateOrderPage from 'pages/orders/CreateOrderPage';
import { RequiredAnonymous } from 'components/RequiredAnonymous';
import { CenterLayout } from 'pages/layouts/CenterLayout';
import { MainLayout } from 'pages/layouts/MainLayout';
import { useAuthInterceptors } from 'hooks/useAuthInterceptors';
import ListExistedOrdersPage from 'pages/orders/ListExistedOrdersPage';
import SalesHistoryPage from 'pages/sales/SalesHistoryPage.tsx';
import CataloguePage from 'pages/articles/CataloguePage';
import TypeNote from 'pages/payments/TypeNote';
import TypeInvoices from 'pages/payments/invoice/TypeInvoices';
import NewClient from 'pages/payments/invoice/NewClient';
import ExistingClient from 'pages/payments/invoice/ExistingClient';
import FacturaElectronica from 'pages/payments/invoice/FacturaElectronica';
import PromotionsPage from 'pages/articles/PromotionsPage';
import AccountsPage from 'pages/accounts';
import TaskBox from 'pages/taskbox';
import Contador from 'pages/contador/index';
import Asistencia from '../src/pages/asistencia/index';
import { MenuCataloguePage } from 'pages/articles/MenuCataloguePage';
import ClientesPage from 'pages/catalogues/Clientes';
import SucusalesPage from './pages/catalogues/Sucursales';
import UsuariosPage from 'pages/catalogues/Usuarios';
import RolesPage from 'pages/catalogues/Roles';


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
          }>
          <Route path="/"
            element={
              <RequiredAnonymous>
                <HomePage />
              </RequiredAnonymous>
            }/>
          <Route
            path="/login"
            element={
              <RequiredAnonymous>
                <LoginPage />
              </RequiredAnonymous>
            }/>
          <Route
            path="/login/welcomen"
            element={
              <RequiredAuthentication>
                <WelcomenPage />
              </RequiredAuthentication>
            }/>
        </Route>

        <Route
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }>
          <Route path="/dashboard"
            element={
              <RequiredAuthentication>
                <DashboardPage />
              </RequiredAuthentication>
            }/>
          <Route path="/orders/new"
            element={
              <RequiredAuthentication>
                <CreateOrderPage />
              </RequiredAuthentication>
            }/>
          <Route path="/orders/edit/:id"
            element={
              <RequiredAuthentication>
                <CreateOrderPage />
              </RequiredAuthentication>
            }/>
          <Route path="/orders"
            element={
              <RequiredAuthentication>
                <ListExistedOrdersPage />
              </RequiredAuthentication>
            }/>
          <Route path="/orders/typeNote"
            element={
              <RequiredAuthentication>
                <TypeNote />
              </RequiredAuthentication>
            }/>
          <Route path="/orders/typeInvoice"
            element={
              <RequiredAuthentication>
                <TypeInvoices />
              </RequiredAuthentication>
            }/>
          <Route path="/orders/typeInvoice/newCliente"
            element={
              <RequiredAuthentication>
                <NewClient/>
              </RequiredAuthentication>
            }/>
          <Route path="/orders/typeInvoice/FacturaElectronica"
            element={
              <RequiredAuthentication>
                <FacturaElectronica/>
              </RequiredAuthentication>
            }/>
          <Route path="/sales"
            element={
              <RequiredAuthentication>
                <SalesHistoryPage />
              </RequiredAuthentication>
            }/>
          <Route path="/catalogue"
            element={
              <RequiredAuthentication>
                <CataloguePage />
              </RequiredAuthentication>
            }/>

          <Route path="/menucatalogue"
            element={
              <RequiredAuthentication>
                <MenuCataloguePage />
              </RequiredAuthentication>
            }/>
          <Route path="/menucatalogue/clientes"
            element={
              <RequiredAuthentication>
                <ClientesPage />
              </RequiredAuthentication>
            }/>
          
          <Route path="/menucatalogue/sucursales"
            element={
              <RequiredAuthentication>
                <SucusalesPage />
              </RequiredAuthentication>
            }/>

          <Route path="/menucatalogue/usuarios"
            element={
              <RequiredAuthentication>
                <UsuariosPage />
              </RequiredAuthentication>
            }/>
            <Route path="/menucatalogue/roles"
            element={
              <RequiredAuthentication>
                <RolesPage />
              </RequiredAuthentication>
            }/>

          <Route path="/promotions"
            element={
              <RequiredAuthentication>
                <PromotionsPage />
              </RequiredAuthentication>
            }/>
          <Route path="/accounts"
            element={
              <RequiredAuthentication>
                <AccountsPage />
              </RequiredAuthentication>
            }/>

          <Route path="/taskbox"
            element={
              <RequiredAuthentication>
                <TaskBox/>
              </RequiredAuthentication>
            }/>

            <Route path="/contador"
            element={
              <RequiredAuthentication>
                <Contador />
              </RequiredAuthentication>
            }/>
             <Route path="/asistencia"
            element={
              <RequiredAuthentication>
                <Asistencia />
              </RequiredAuthentication>
            }/>
        </Route>

        
      </Routes>
    </ChakraProvider>
  );
};
