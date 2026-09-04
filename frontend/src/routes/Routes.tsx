import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'components/layout/Layout';
import Companies from 'pages/companies/Companies';
import CompanyNew from 'pages/companies/registration/new/CompanyNew';
import CompanyUpdate from 'pages/companies/registration/update/CompanyUpdate';
import Error404 from 'pages/error/Error404';
import Products from 'pages/products/Products';
import ProductNew from 'pages/products/registration/new/ProductNew';
import ProductUpdate from 'pages/products/registration/update/ProductUpdate';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/companies" replace />} />

        <Route path="companies" element={<Companies />} />
        <Route path="companies/new" element={<CompanyNew />} />
        <Route path="companies/:id" element={<CompanyUpdate />} />

        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductNew />} />
        <Route path="products/:id" element={<ProductUpdate />} />

        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
