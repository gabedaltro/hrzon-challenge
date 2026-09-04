import React from 'react';
import List from 'components/list/List';
import { Product } from 'types/product';
import ProductItemModule from './ProductItemModule';

type ProductListModuleProps = {
  products: Product[];
};

const ProductListModule: React.FC<ProductListModuleProps> = ({ products }) => {
  return (
    <List>
      {products.map(product => (
        <ProductItemModule key={product.id} product={product} />
      ))}
    </List>
  );
};

export default ProductListModule;
