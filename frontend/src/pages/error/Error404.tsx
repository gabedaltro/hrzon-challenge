import React from 'react';
import { Button, Typography, styled } from '@mui/material';
import history from 'services/history';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  padding: '80px 20px',
});

const Error404: React.FC = () => {
  return (
    <Container>
      <Typography variant="h5">Página não encontrada</Typography>
      <Typography color="textSecondary">O endereço acessado não existe ou foi movido.</Typography>
      <Button variant="contained" color="secondary" onClick={() => history.push('/companies')}>
        Ir para as empresas
      </Button>
    </Container>
  );
};

export default Error404;
