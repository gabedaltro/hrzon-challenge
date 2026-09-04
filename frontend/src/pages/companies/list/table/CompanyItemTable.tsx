import React from 'react';
import { Typography } from '@mui/material';
import { useTable } from 'components/table/hook/useTable';
import SituationChips from 'components/status-chip/SituationChips';
import { Company } from 'types/company';
import CompanyActionsMenu from '../../actions/CompanyActionsMenu';

type CompanyItemTableProps = {
  company: Company;
};

const CompanyItemTable: React.FC<CompanyItemTableProps> = ({ company }) => {
  const { tableTemplate } = useTable();

  return (
    <>
      {tableTemplate.map(item => {
        if (item.id === 'actions') {
          return (
            <div key={item.id}>
              <CompanyActionsMenu company={company} />
            </div>
          );
        }

        if (item.id === 'situation') {
          return (
            <div key={item.id}>
              <SituationChips status={company.status} trashed={company.is_trashed} />
            </div>
          );
        }

        return (
          <div key={item.id}>
            <Typography variant="body2" noWrap title={String(company[item.id as keyof Company] ?? '')}>
              {String(company[item.id as keyof Company] ?? '')}
            </Typography>
          </div>
        );
      })}
    </>
  );
};

export default CompanyItemTable;
