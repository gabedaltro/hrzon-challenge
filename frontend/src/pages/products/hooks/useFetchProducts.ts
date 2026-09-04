import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { api } from 'services/api';
import { apiErrorMessage } from 'helpers/apiErrorMessage';
import { dateFormatter } from 'helpers/dateFormatter';
import { moneyFormatter } from 'helpers/moneyFormatter';
import { Paginated } from 'types/paginated';
import { Product } from 'types/product';
import { Status, TrashedFilter } from 'types/status';
import { TableOrder } from 'types/tableOrder';

export type ProductsFilter = {
  name: string;
  status: Status | '';
  company_id: number | '';
  trashed: TrashedFilter;
};

const initialFilter: ProductsFilter = {
  name: '',
  status: '',
  company_id: '',
  trashed: 'without',
};

function formatProduct(product: Product): Product {
  return {
    ...product,
    formattedPrice: moneyFormatter(product.price),
    formattedCreatedAt: dateFormatter(product.created_at),
    companyName: product.company?.name ?? '',
  };
}

export function useFetchProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<ProductsFilter>(initialFilter);
  const [order, setOrder] = useState<TableOrder>({ index: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    // O filtro por nome dispara a cada tecla, por isso a espera antes da requisição.
    const timer = setTimeout(() => {
      api
        .get<Paginated<Product>>('/products', {
          signal: controller.signal,
          params: {
            name: filter.name || undefined,
            status: filter.status || undefined,
            company_id: filter.company_id || undefined,
            trashed: filter.trashed,
            order_by: order.index,
            direction: order.direction,
            page,
            per_page: rowsPerPage,
          },
        })
        .then(response => {
          setProducts(response.data.data.map(formatProduct));
          setTotal(response.data.meta.total);
          setLastPage(response.data.meta.last_page);
          setError('');
        })
        .catch(err => {
          if (axios.isCancel(err)) return;

          setProducts([]);
          setError(apiErrorMessage(err, 'Não foi possível carregar os produtos.'));
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filter, order, page, rowsPerPage, refreshKey]);

  // Excluir o último registro de uma página deixa o usuário parado numa página que não existe mais.
  useEffect(() => {
    if (page > lastPage) setPage(lastPage);
  }, [lastPage, page]);

  const refresh = useCallback(() => {
    setRefreshKey(key => key + 1);
  }, []);

  function handleChangeFilter(index: keyof ProductsFilter, value: string | number) {
    setFilter(state => ({ ...state, [index]: value }));
    setPage(1);
  }

  // Trocar a ordenação recomeça da primeira página: a ordem toda muda, não só a página atual.
  function handleSort(index: string) {
    setOrder(state => ({
      index,
      direction: state.index === index && state.direction === 'asc' ? 'desc' : 'asc',
    }));
    setPage(1);
  }

  function handleSetRowsPerPage(rowsPerPage: number) {
    setRowsPerPage(rowsPerPage);
    setPage(1);
  }

  return {
    products,
    filter,
    handleChangeFilter,
    order,
    handleSort,
    page,
    setPage,
    rowsPerPage,
    handleSetRowsPerPage,
    total,
    loading,
    error,
    refresh,
  };
}
