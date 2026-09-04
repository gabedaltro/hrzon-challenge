import React from 'react';
import { CircularProgress, Typography, styled } from '@mui/material';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  flex: 1,
  padding: '60px 20px',
});

type InsideLoadingProps = {
  message?: string;
};

const InsideLoading: React.FC<InsideLoadingProps> = ({ message = 'Carregando...' }) => {
  return (
    <Container>
      <CircularProgress color="primary" size={28} />
      <Typography variant="body2" color="textSecondary">
        {message}
      </Typography>
    </Container>
  );
};

export default InsideLoading;
