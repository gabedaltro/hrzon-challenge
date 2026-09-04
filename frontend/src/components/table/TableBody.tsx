import React, { ReactNode } from 'react';
import { styled } from '@mui/material';
import { useTable } from './hook/useTable';

const Body = styled('div')<{ width: number }>(({ width }) => ({
  minWidth: width,
}));

type TableBodyProps = {
  children: ReactNode;
};

const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  const { width } = useTable();

  return <Body width={width}>{children}</Body>;
};

export default TableBody;
