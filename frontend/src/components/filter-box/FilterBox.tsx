import React, { ReactNode } from 'react';
import { styled } from '@mui/material';

const Container = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '8px 8px 0 0',
  borderBottom: '1px solid #e0e0e0',
  padding: 15,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 15,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

type FilterBoxProps = {
  children: ReactNode;
};

const FilterBox: React.FC<FilterBoxProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default FilterBox;
