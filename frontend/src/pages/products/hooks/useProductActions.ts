import { useMemo, useState } from 'react';
import { useMessaging } from 'hooks/messaging';
import { apiErrorMessage } from 'helpers/apiErrorMessage';
import { Product } from 'types/product';
import { ProductActionType, productActionCopy, productActionRequest } from '../actions/productActions';

type SelectedAction = {
  product: Product;
  action: ProductActionType;
};

export function useProductActions(refresh: () => void) {
  const [selected, setSelected] = useState<SelectedAction | null>(null);
  const [saving, setSaving] = useState(false);
  const { handleOpen } = useMessaging();

  const copy = useMemo(() => (selected ? productActionCopy(selected.product, selected.action) : null), [selected]);

  function handleSelectAction(product: Product, action: ProductActionType) {
    setSelected({ product, action });
  }

  function handleCloseAction() {
    setSelected(null);
  }

  function handleConfirmAction() {
    if (!selected || !copy) return;

    setSaving(true);

    productActionRequest(selected.product, selected.action)
      .then(() => {
        handleOpen(copy.successMessage);
        setSelected(null);
        refresh();
      })
      .catch(err => {
        handleOpen(apiErrorMessage(err), 'error');
      })
      .finally(() => {
        setSaving(false);
      });
  }

  return {
    selected,
    copy,
    saving,
    handleSelectAction,
    handleCloseAction,
    handleConfirmAction,
  };
}
