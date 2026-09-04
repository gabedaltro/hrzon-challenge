import React from 'react';
import TableBody from 'components/table/TableBody';
import TableContent from 'components/table/TableContent';
import TableHeader from 'components/table/TableHeader';
import TableHeaderItem from 'components/table/TableHeaderItem';
import TableRow from 'components/table/TableRow';
import { useTable } from 'components/table/hook/useTable';
import { Product } from 'types/product';
import { TableOrder } from 'types/tableOrder';
import ProductItemTable from './ProductItemTable';

type ProductListTableProps = {
  products: Product[];
  order: TableOrder;
  handleSort(index: string): void;
};

const ProductListTable: React.FC<ProductListTableProps> = ({ products, order, handleSort }) => {
  const { tableTemplate } = useTable();

  return (
    <TableContent>
      <TableHeader>
        {tableTemplate.map(item => (
          <TableHeaderItem key={item.id} item={item} order={order} handleSort={handleSort} />
        ))}
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id} faded={product.is_trashed}>
            <ProductItemTable product={product} />
          </TableRow>
        ))}
      </TableBody>
    </TableContent>
  );
};

export default ProductListTable;
