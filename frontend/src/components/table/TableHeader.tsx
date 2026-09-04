import React, { ReactNode } from 'react';
import { styled } from '@mui/material';
import { useTable } from './hook/useTable';

type StyleProps = {
  templateColumns: string;
  width: number;
};

const Header = styled('div')<StyleProps>(({ templateColumns, width }) => ({
  display: 'grid',
  gridTemplateColumns: templateColumns,
  minWidth: width,
  borderBottom: '1px solid #e0e0e0',
  backgroundColor: '#fafafa',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  '& > div': {
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
  },
  '& > div.numericData': {
    justifyContent: 'flex-end',
  },
}));

type TableHeaderProps = {
  children: ReactNode;
};

const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  const { templateColumns, width } = useTable();

  return (
    <Header templateColumns={templateColumns} width={width}>
      {children}
    </Header>
  );
};

export default TableHeader;
