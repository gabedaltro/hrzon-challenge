import React from 'react';
import { Skeleton, styled } from '@mui/material';

const Container = styled('div')({
  display: 'grid',
  gap: 10,
  padding: 10,
});

const ModuleLoading: React.FC = () => {
  return (
    <Container>
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={104} />
      ))}
    </Container>
  );
};

export default ModuleLoading;
