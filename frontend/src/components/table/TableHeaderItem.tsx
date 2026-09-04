import React from 'react';
import { Typography, styled } from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { TableOrder } from 'types/tableOrder';
import { TableTemplate } from 'types/tableTemplate';

const SortButton = styled('button')({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: 'inherit',
  font: 'inherit',
  '& > svg': {
    fontSize: 16,
  },
});

type TableHeaderItemProps = {
  item: TableTemplate;
  order: TableOrder;
  handleSort(index: string): void;
};

/**
 * Cabeçalho da coluna. A ordenação é feita pela API, então o clique manda o nome da coluna
 * (`originalId`) e não mexe na lista em memória. Colunas sem coluna equivalente na API,
 * como a de ações, ficam sem o botão.
 */
const TableHeaderItem: React.FC<TableHeaderItemProps> = ({ item, order, handleSort }) => {
  const className = item.dataType === 'number' ? 'numericData' : undefined;

  if (item.notSortable) {
    return (
      <div className={className}>
        <Typography variant="caption" fontWeight={600}>
          {item.description}
        </Typography>
      </div>
    );
  }

  const ordered = order.index === item.originalId;

  return (
    <div className={className}>
      <SortButton
        type="button"
        onClick={() => handleSort(item.originalId)}
        aria-label={`Ordenar por ${item.description.toLowerCase()}`}
      >
        <Typography variant="caption" fontWeight={600} color={ordered ? 'text.primary' : 'text.secondary'}>
          {item.description}
        </Typography>
        {ordered && (order.direction === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
      </SortButton>
    </div>
  );
};

export default TableHeaderItem;
