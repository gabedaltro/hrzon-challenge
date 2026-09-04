import { api } from 'services/api';
import { Product } from 'types/product';

export type ProductActionType = 'inactivate' | 'reactivate' | 'delete' | 'restore' | 'force_delete';

export type ProductActionCopy = {
  title: string;
  description: string;
  warning?: string;
  confirmLabel: string;
  danger?: boolean;
  successMessage: string;
};

/** Texto de cada confirmação, deixando claro o que muda e o que não tem volta. */
export function productActionCopy(product: Product, action: ProductActionType): ProductActionCopy {
  switch (action) {
    case 'inactivate':
      return {
        title: `Inativar ${product.name}?`,
        description: 'O produto continua na listagem, marcado como inativo, e pode ser reativado depois.',
        confirmLabel: 'Inativar',
        successMessage: 'Produto inativado.',
      };

    case 'reactivate':
      return {
        title: `Reativar ${product.name}?`,
        description: 'O produto volta a ficar ativo na empresa em que está vinculado.',
        confirmLabel: 'Reativar',
        successMessage: 'Produto reativado.',
      };

    case 'delete':
      return {
        title: `Excluir ${product.name}?`,
        description:
          'O produto sai das listagens, mas continua guardado e pode ser restaurado pelo filtro de registros excluídos.',
        confirmLabel: 'Excluir',
        successMessage: 'Produto excluído.',
      };

    case 'restore':
      return {
        title: `Restaurar ${product.name}?`,
        description: 'O produto volta para as listagens no mesmo status em que estava.',
        warning: 'A restauração é recusada se o código interno já estiver em uso por outro produto da mesma empresa.',
        confirmLabel: 'Restaurar',
        successMessage: 'Produto restaurado.',
      };

    case 'force_delete':
      return {
        title: `Excluir ${product.name} definitivamente?`,
        description: 'O registro será apagado do banco de dados.',
        warning: 'Esta ação não tem volta: o produto não poderá mais ser restaurado.',
        confirmLabel: 'Excluir definitivamente',
        danger: true,
        successMessage: 'Produto excluído definitivamente.',
      };
  }
}

export function productActionRequest(product: Product, action: ProductActionType) {
  switch (action) {
    case 'inactivate':
      return api.post(`/products/${product.id}/inactivate`);
    case 'reactivate':
      return api.post(`/products/${product.id}/reactivate`);
    case 'delete':
      return api.delete(`/products/${product.id}`);
    case 'restore':
      return api.post(`/products/${product.id}/restore`);
    case 'force_delete':
      return api.delete(`/products/${product.id}/force`);
  }
}
