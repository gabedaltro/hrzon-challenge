import React from 'react';
import { Typography, styled } from '@mui/material';
import SituationChips from 'components/status-chip/SituationChips';
import { Product } from 'types/product';
import ProductActionsMenu from '../../actions/ProductActionsMenu';
import ProductCompanyLabel from '../ProductCompanyLabel';

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

type ProductItemModuleProps = {
  product: Product;
};

const ProductItemModule: React.FC<ProductItemModuleProps> = ({ product }) => {
  return (
    <Container faded={product.is_trashed}>
      <Header>
        <div>
          <Typography variant="subtitle1" fontWeight={600}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {product.internal_code}
          </Typography>
        </div>
        <ProductActionsMenu product={product} />
      </Header>

      <SituationChips status={product.status} trashed={product.is_trashed} />

      <ProductCompanyLabel company={product.company} />

      <Typography variant="h6">{product.formattedPrice}</Typography>
    </Container>
  );
};

export default ProductItemModule;
