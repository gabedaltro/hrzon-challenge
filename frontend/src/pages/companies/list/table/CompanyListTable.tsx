import React from 'react';
import TableBody from 'components/table/TableBody';
import TableContent from 'components/table/TableContent';
import TableHeader from 'components/table/TableHeader';
import TableHeaderItem from 'components/table/TableHeaderItem';
import TableRow from 'components/table/TableRow';
import { useTable } from 'components/table/hook/useTable';
import { Company } from 'types/company';
import { TableOrder } from 'types/tableOrder';
import CompanyItemTable from './CompanyItemTable';

type CompanyListTableProps = {
  companies: Company[];
  order: TableOrder;
  handleSort(index: string): void;
};

const CompanyListTable: React.FC<CompanyListTableProps> = ({ companies, order, handleSort }) => {
  const { tableTemplate } = useTable();

  return (
    <TableContent>
      <TableHeader>
        {tableTemplate.map(item => (
          <TableHeaderItem key={item.id} item={item} order={order} handleSort={handleSort} />
        ))}
      </TableHeader>
      <TableBody>
        {companies.map(company => (
          <TableRow key={company.id} faded={company.is_trashed}>
            <CompanyItemTable company={company} />
          </TableRow>
        ))}
      </TableBody>
    </TableContent>
  );
};

export default CompanyListTable;
