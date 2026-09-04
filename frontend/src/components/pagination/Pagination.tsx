import React from 'react';
import { TablePagination } from '@mui/material';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/constants';

type PaginationProps = {
  count: number;
  /** Página corrente na contagem da API, começando em 1. */
  page: number;
  rowsPerPage: number;
  handleSetPage(page: number): void;
  handleSetRowsPerPage(rowsPerPage: number): void;
};

/** A paginação é resolvida pela API: o componente só reporta a página escolhida. */
const Pagination: React.FC<PaginationProps> = ({ count, page, rowsPerPage, handleSetPage, handleSetRowsPerPage }) => {
  return (
    <TablePagination
      component="div"
      labelRowsPerPage="Registros por página"
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
      count={count}
      page={page - 1}
      rowsPerPage={rowsPerPage}
      onPageChange={(_, page) => handleSetPage(page + 1)}
      onRowsPerPageChange={e => handleSetRowsPerPage(parseInt(e.target.value, 10))}
    />
  );
};

export default Pagination;
