import { api } from 'services/api';
import { Company } from 'types/company';

export type CompanyActionType = 'inactivate' | 'reactivate' | 'delete' | 'restore' | 'force_delete';

export type CompanyActionCopy = {
  title: string;
  description: string;
  warning?: string;
  confirmLabel: string;
  danger?: boolean;
  successMessage: string;
};

export function companyActionCopy(company: Company, action: CompanyActionType): CompanyActionCopy {
  const products = company.products_count;
  const productsLabel = products === 1 ? '1 produto vinculado' : `${products} produtos vinculados`;

  switch (action) {
    case 'inactivate':
      return {
        title: `Inativar ${company.name}?`,
        description:
          'A empresa continua na listagem, mas fica marcada como inativa e não pode receber novos produtos. ' +
          'Você pode reativá-la depois.',
        warning:
          products > 0
            ? `${productsLabel} também ${products === 1 ? 'ficará inativo' : 'ficarão inativos'}.`
            : undefined,
        confirmLabel: 'Inativar',
        successMessage: 'Empresa inativada.',
      };

    case 'reactivate':
      return {
        title: `Reativar ${company.name}?`,
        description: 'A empresa volta a aceitar novos produtos.',
        warning:
          products > 0
            ? 'Os produtos que ficaram inativos não voltam sozinhos: cada um precisa ser reativado individualmente.'
            : undefined,
        confirmLabel: 'Reativar',
        successMessage: 'Empresa reativada.',
      };

    case 'delete':
      return {
        title: `Excluir ${company.name}?`,
        description:
          'A empresa sai das listagens, mas continua guardada e pode ser restaurada pelo filtro de registros excluídos.',
        warning:
          products > 0
            ? `${productsLabel} ${products === 1 ? 'será excluído' : 'serão excluídos'} junto com a empresa.`
            : undefined,
        confirmLabel: 'Excluir',
        successMessage: 'Empresa excluída.',
      };

    case 'restore':
      return {
        title: `Restaurar ${company.name}?`,
        description: 'A empresa volta para as listagens no mesmo status em que estava.',
        warning: 'Os produtos excluídos junto com ela também voltam. Os excluídos individualmente continuam excluídos.',
        confirmLabel: 'Restaurar',
        successMessage: 'Empresa restaurada.',
      };

    case 'force_delete':
      return {
        title: `Excluir ${company.name} definitivamente?`,
        description: 'O registro será apagado do banco de dados.',
        warning: 'Esta ação não tem volta: a empresa não poderá mais ser restaurada.',
        confirmLabel: 'Excluir definitivamente',
        danger: true,
        successMessage: 'Empresa excluída definitivamente.',
      };
  }
}

export function companyActionRequest(company: Company, action: CompanyActionType) {
  switch (action) {
    case 'inactivate':
      return api.post(`/companies/${company.id}/inactivate`);
    case 'reactivate':
      return api.post(`/companies/${company.id}/reactivate`);
    case 'delete':
      return api.delete(`/companies/${company.id}`);
    case 'restore':
      return api.post(`/companies/${company.id}/restore`);
    case 'force_delete':
      return api.delete(`/companies/${company.id}/force`);
  }
}
