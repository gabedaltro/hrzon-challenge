import React, { ReactNode } from 'react';
import { styled } from '@mui/material';

const Container = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 10,
  padding: 10,
});

type ListProps = {
  children: ReactNode;
};

const List: React.FC<ListProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default List;
