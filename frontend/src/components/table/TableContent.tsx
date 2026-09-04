import React, { ReactNode } from 'react';
import { styled } from '@mui/material';

const Container = styled('div')({
  width: '100%',
  overflowX: 'auto',
  position: 'relative',
});

type TableContentProps = {
  children: ReactNode;
};

const TableContent: React.FC<TableContentProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default TableContent;
