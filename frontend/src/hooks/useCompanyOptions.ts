import axios from 'axios';
import { useEffect, useState } from 'react';
import { api } from 'services/api';
import { cnpjFormatter } from 'helpers/cnpjFormatter';
import { Company, SelectableCompany } from 'types/company';
import { Paginated } from 'types/paginated';

type UseCompanyOptionsParams = {
  /**
   * Quando verdadeiro, busca em `/companies/selectable`, que devolve apenas empresas ativas
   * e não excluídas — as únicas que podem receber um produto.
   */
  onlySelectable: boolean;
};

export function useCompanyOptions({ onlySelectable }: UseCompanyOptionsParams) {
  const [options, setOptions] = useState<SelectableCompany[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    const timer = setTimeout(() => {
      const request = onlySelectable
        ? api
            .get<{ data: SelectableCompany[] }>('/companies/selectable', {
              signal: controller.signal,
              params: { name: search || undefined },
            })
            .then(response => response.data.data)
        : api
            .get<Paginated<Company>>('/companies', {
              signal: controller.signal,
              params: { name: search || undefined, trashed: 'with', per_page: 50 },
            })
            .then(response =>
              response.data.data.map(company => ({
                id: company.id,
                name: company.name,
                cnpj_formatted: cnpjFormatter(company.cnpj),
              })),
            );

      request
        .then(setOptions)
        .catch(err => {
          if (axios.isCancel(err)) return;

          setOptions([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, onlySelectable]);

  return {
    options,
    loading,
    search,
    setSearch,
  };
}
