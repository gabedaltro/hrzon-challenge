import React from 'react';
import { Typography } from '@mui/material';
import { useTable } from 'components/table/hook/useTable';
import SituationChips from 'components/status-chip/SituationChips';
import { Product } from 'types/product';
import ProductActionsMenu from '../../actions/ProductActionsMenu';
import ProductCompanyLabel from '../ProductCompanyLabel';

type ProductItemTableProps = {
  product: Product;
};

const ProductItemTable: React.FC<ProductItemTableProps> = ({ product }) => {
  const { tableTemplate } = useTable();

  return (
    <>
      {tableTemplate.map(item => {
        if (item.id === 'actions') {
          return (
            <div key={item.id}>
              <ProductActionsMenu product={product} />
            </div>
          );
        }

        if (item.id === 'situation') {
          return (
            <div key={item.id}>
              <SituationChips status={product.status} trashed={product.is_trashed} />
            </div>
          );
        }

        if (item.id === 'companyName') {
          return (
            <div key={item.id}>
              <ProductCompanyLabel company={product.company} />
            </div>
          );
        }

        return (
          <div key={item.id} className={item.dataType === 'number' ? 'numericData' : undefined}>
            <Typography variant="body2" noWrap title={String(product[item.id as keyof Product] ?? '')}>
              {String(product[item.id as keyof Product] ?? '')}
            </Typography>
          </div>
        );
      })}
    </>
  );
};

export default ProductItemTable;
