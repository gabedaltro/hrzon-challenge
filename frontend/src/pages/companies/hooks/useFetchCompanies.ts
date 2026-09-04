import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { api } from 'services/api';
import { apiErrorMessage } from 'helpers/apiErrorMessage';
import { cnpjFormatter } from 'helpers/cnpjFormatter';
import { dateFormatter } from 'helpers/dateFormatter';
import { phoneNumberFormatter } from 'helpers/phoneNumberFormatter';
import { Company } from 'types/company';
import { Paginated } from 'types/paginated';
import { Status, TrashedFilter } from 'types/status';
import { TableOrder } from 'types/tableOrder';

export type CompaniesFilter = {
  name: string;
  status: Status | '';
  trashed: TrashedFilter;
};

const initialFilter: CompaniesFilter = {
  name: '',
  status: '',
  trashed: 'without',
};

function formatCompany(company: Company): Company {
  return {
    ...company,
    cnpj_formatted: cnpjFormatter(company.cnpj),
    formattedPhone: phoneNumberFormatter(company.phone),
    formattedCreatedAt: dateFormatter(company.created_at),
  };
}

export function useFetchCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filter, setFilter] = useState<CompaniesFilter>(initialFilter);
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
        .get<Paginated<Company>>('/companies', {
          signal: controller.signal,
          params: {
            name: filter.name || undefined,
            status: filter.status || undefined,
            trashed: filter.trashed,
            order_by: order.index,
            direction: order.direction,
            page,
            per_page: rowsPerPage,
          },
        })
        .then(response => {
          setCompanies(response.data.data.map(formatCompany));
          setTotal(response.data.meta.total);
          setLastPage(response.data.meta.last_page);
          setError('');
        })
        .catch(err => {
          if (axios.isCancel(err)) return;

          setCompanies([]);
          setError(apiErrorMessage(err, 'Não foi possível carregar as empresas.'));
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

  function handleChangeFilter(index: keyof CompaniesFilter, value: string) {
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
    companies,
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
