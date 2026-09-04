import { useMemo, useState } from 'react';
import { useMessaging } from 'hooks/messaging';
import { apiErrorMessage } from 'helpers/apiErrorMessage';
import { Company } from 'types/company';
import { CompanyActionType, companyActionCopy, companyActionRequest } from '../actions/companyActions';

type SelectedAction = {
  company: Company;
  action: CompanyActionType;
};

export function useCompanyActions(refresh: () => void) {
  const [selected, setSelected] = useState<SelectedAction | null>(null);
  const [saving, setSaving] = useState(false);
  const { handleOpen } = useMessaging();

  const copy = useMemo(() => (selected ? companyActionCopy(selected.company, selected.action) : null), [selected]);

  function handleSelectAction(company: Company, action: CompanyActionType) {
    setSelected({ company, action });
  }

  function handleCloseAction() {
    setSelected(null);
  }

  function handleConfirmAction() {
    if (!selected || !copy) return;

    setSaving(true);

    companyActionRequest(selected.company, selected.action)
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
