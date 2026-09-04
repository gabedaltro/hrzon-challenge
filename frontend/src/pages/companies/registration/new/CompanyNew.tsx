import React, { FormEvent, useState } from 'react';
import Loading from 'components/loading/Loading';
import PageHeader from 'components/page-header/PageHeader';
import { apiErrorMessage } from 'helpers/apiErrorMessage';
import { apiValidationErrors } from 'helpers/apiValidationErrors';
import { useMessaging } from 'hooks/messaging';
import { api } from 'services/api';
import history from 'services/history';
import { CompanyPayload } from 'types/company';
import CompanyActions from '../CompanyActions';
import CompanyForm from '../CompanyForm';
import { CompanyValidation, useCompanyValidation } from '../validation/companyValidation';

const initialCompany: CompanyPayload = {
  name: '',
  cnpj: '',
  email: '',
  phone: '',
};

const CompanyNew: React.FC = () => {
  const [company, setCompany] = useState<CompanyPayload>(initialCompany);
  const [validation, setValidation, validate] = useCompanyValidation();
  const [saving, setSaving] = useState(false);
  const { handleOpen } = useMessaging();

  function handleChange(index: keyof CompanyPayload, value: string) {
    setCompany(state => ({ ...state, [index]: value }));
  }

  function handleValidation(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setValidation({});

    validate(company)
      .then(handleSubmit)
      .catch(() => {
        // O campo inválido já recebeu a mensagem e o foco pelo hook de validação.
      });
  }

  function handleSubmit() {
    setSaving(true);

    api
      .post('/companies', company)
      .then(() => {
        handleOpen('Empresa cadastrada.');
        history.push('/companies');
      })
      .catch(err => {
        const errors = apiValidationErrors<CompanyValidation>(err);

        if (errors) setValidation(errors);

        handleOpen(apiErrorMessage(err), 'error');
      })
      .finally(() => {
        setSaving(false);
      });
  }

  return (
    <>
      {saving && <Loading />}

      <PageHeader
        title="Nova empresa"
        description="Cadastro de fornecedor"
        backUrl="/companies"
        ActionComponent={<CompanyActions saving={saving} handleSubmit={handleValidation} />}
      />

      <form onSubmit={handleValidation} noValidate>
        <CompanyForm company={company} handleChange={handleChange} validation={validation} />
      </form>
    </>
  );
};

export default CompanyNew;
