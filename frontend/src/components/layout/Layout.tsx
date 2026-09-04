import React from 'react';
import { Container, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Appbar from 'components/appbar/Appbar';

const Main = styled('main')(({ theme }) => ({
  paddingTop: 30,
  paddingBottom: 60,
  [theme.breakpoints.down('sm')]: {
    paddingTop: 20,
  },
}));

const Layout: React.FC = () => {
  return (
    <>
      <Appbar />
      <Container maxWidth="xl">
        <Main>
          <Outlet />
        </Main>
      </Container>
    </>
  );
};

export default Layout;
