import React, { ReactNode, useMemo } from 'react';
import { styled } from '@mui/material';
import { TableTemplate } from 'types/tableTemplate';
import { TableContextProvider } from './hook/useTable';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#fff',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  overflow: 'hidden',
});

type TableContainerProps = {
  tableTemplate: TableTemplate[];
  children: ReactNode;
};

/**
 * A tabela é montada com CSS grid: cada coluna do template vira uma faixa de largura fixa,
 * e a soma delas define a largura mínima antes de aparecer a rolagem horizontal.
 */
const TableContainer: React.FC<TableContainerProps> = ({ tableTemplate, children }) => {
  const columns = useMemo(() => tableTemplate.filter(item => !item.notShow), [tableTemplate]);

  const templateColumns = useMemo(() => columns.map(item => `${item.width}px`).join(' '), [columns]);

  const width = useMemo(() => columns.reduce((total, item) => total + item.width, 0), [columns]);

  return (
    <TableContextProvider value={{ width, tableTemplate: columns, templateColumns }}>
      <Container>{children}</Container>
    </TableContextProvider>
  );
};

export default TableContainer;
