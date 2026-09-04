import React, { ReactNode } from 'react';
import { styled } from '@mui/material';
import { useTable } from './hook/useTable';

type StyleProps = {
  templateColumns: string;
  width: number;
  faded: boolean;
};

const Row = styled('div', { shouldForwardProp: prop => prop !== 'templateColumns' && prop !== 'faded' })<StyleProps>(
  ({ templateColumns, width, faded }) => ({
    display: 'grid',
    gridTemplateColumns: templateColumns,
    minWidth: width,
    minHeight: 48,
    borderBottom: '1px solid #eee',
    backgroundColor: faded ? '#fbfbfb' : 'transparent',
    '&:last-of-type': {
      borderBottom: 'none',
    },
    '&:hover': {
      backgroundColor: '#f7f7f7',
    },
    '& > div': {
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      minWidth: 0,
    },
    '& > div.numericData': {
      justifyContent: 'flex-end',
    },
  }),
);

type TableRowProps = {
  children: ReactNode;
  /** Registros excluídos logicamente entram com menos peso visual. */
  faded?: boolean;
};

const TableRow: React.FC<TableRowProps> = ({ children, faded = false }) => {
  const { templateColumns, width } = useTable();

  return (
    <Row templateColumns={templateColumns} width={width} faded={faded}>
      {children}
    </Row>
  );
};

export default TableRow;
