import React from 'react';
import { Skeleton, styled } from '@mui/material';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 20,
  backgroundColor: '#fff',
});

const TableLoading: React.FC = () => {
  return (
    <Container>
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={38} />
      ))}
    </Container>
  );
};

export default TableLoading;
