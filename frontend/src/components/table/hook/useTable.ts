import { createContext, useContext } from 'react';
import { TableTemplate } from 'types/tableTemplate';

type TableContextValue = {
  width: number;
  tableTemplate: TableTemplate[];
  templateColumns: string;
};

const TableContext = createContext<TableContextValue>({} as TableContextValue);

export const TableContextProvider = TableContext.Provider;

export function useTable(): TableContextValue {
  const context = useContext(TableContext);
  return context;
}
