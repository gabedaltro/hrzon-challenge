import React from 'react';
import { Typography, styled } from '@mui/material';
import { ProductCompany } from 'types/product';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
});

type ProductCompanyLabelProps = {
  company: ProductCompany | null;
};

/**
 * Além do nome, avisa quando a empresa não está apta a receber vínculo — é o que explica
 * um produto sem a opção de reativar.
 */
const ProductCompanyLabel: React.FC<ProductCompanyLabelProps> = ({ company }) => {
  if (!company) return <Typography variant="body2">—</Typography>;

  const warning = company.is_trashed ? 'Empresa excluída' : company.status === 'inactive' ? 'Empresa inativa' : '';

  return (
    <Container>
      <Typography variant="body2" noWrap title={company.name}>
        {company.name}
      </Typography>
      {warning && (
        <Typography variant="caption" color="warning.main">
          {warning}
        </Typography>
      )}
    </Container>
  );
};

export default ProductCompanyLabel;
