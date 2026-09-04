import React from 'react';
import List from 'components/list/List';
import { Company } from 'types/company';
import CompanyItemModule from './CompanyItemModule';

type CompanyListModuleProps = {
  companies: Company[];
};

const CompanyListModule: React.FC<CompanyListModuleProps> = ({ companies }) => {
  return (
    <List>
      {companies.map(company => (
        <CompanyItemModule key={company.id} company={company} />
      ))}
    </List>
  );
};

export default CompanyListModule;
