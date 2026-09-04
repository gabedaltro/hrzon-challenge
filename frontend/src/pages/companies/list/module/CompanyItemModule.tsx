import React from 'react';
import { Typography, styled } from '@mui/material';
import SituationChips from 'components/status-chip/SituationChips';
import { Company } from 'types/company';
import CompanyActionsMenu from '../../actions/CompanyActionsMenu';

const Container = styled('div')<{ faded: boolean }>(({ faded }) => ({
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  padding: 15,
  backgroundColor: faded ? '#fbfbfb' : '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}));

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 10,
});

const Data = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

type CompanyItemModuleProps = {
  company: Company;
};

const CompanyItemModule: React.FC<CompanyItemModuleProps> = ({ company }) => {
  return (
    <Container faded={company.is_trashed}>
      <Header>
        <div>
          <Typography variant="subtitle1" fontWeight={600}>
            {company.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {company.cnpj_formatted}
          </Typography>
        </div>
        <CompanyActionsMenu company={company} />
      </Header>

      <SituationChips status={company.status} trashed={company.is_trashed} />

      <Data>
        <Typography variant="body2">{company.email}</Typography>
        <Typography variant="body2">{company.formattedPhone}</Typography>
        <Typography variant="body2" color="textSecondary">
          {company.products_count === 1 ? '1 produto vinculado' : `${company.products_count} produtos vinculados`}
        </Typography>
      </Data>
    </Container>
  );
};

export default CompanyItemModule;
