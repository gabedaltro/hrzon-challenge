import React, { FormEvent, useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import InsideLoading from 'components/loading/InsideLoading';
import Loading from 'components/loading/Loading';
import PageHeader from 'components/page-header/PageHeader';
import { apiErrorMessage } from 'helpers/apiErrorMessage';
import { cnpjMask } from 'helpers/cnpjMask';
import { phoneMask } from 'helpers/phoneMask';
import { apiValidationErrors } from 'helpers/apiValidationErrors';
import { useMessaging } from 'hooks/messaging';
import { useParams } from 'react-router-dom';
import { api } from 'services/api';
import history from 'services/history';
import { Company, CompanyPayload } from 'types/company';
import CompanyActions from '../CompanyActions';
import CompanyForm from '../CompanyForm';
import { CompanyValidation, useCompanyValidation } from '../validation/companyValidation';

const initialCompany: CompanyPayload = {
  name: '',
  cnpj: '',
  email: '',
  phone: '',
};

const CompanyUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyPayload>(initialCompany);
  const [loaded, setLoaded] = useState<Company | null>(null);
  const [validation, setValidation, validate] = useCompanyValidation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { handleOpen } = useMessaging();

  useEffect(() => {
    api
      .get<{ data: Company }>(`/companies/${id}`)
      .then(response => {
        const data = response.data.data;

        setLoaded(data);
        setCompany({
          name: data.name,
          cnpj: cnpjMask(data.cnpj),
          email: data.email,
          phone: phoneMask(data.phone),
        });
      })
      .catch(err => {
        setError(apiErrorMessage(err, 'Não foi possível carregar a empresa.'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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
      .put(`/companies/${id}`, company)
      .then(() => {
        handleOpen('Empresa atualizada.');
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

  if (loading) return <InsideLoading />;

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      {saving && <Loading />}

      <PageHeader
        title="Editar empresa"
        description={loaded?.name}
        backUrl="/companies"
        ActionComponent={<CompanyActions saving={saving} handleSubmit={handleValidation} />}
      />

      <form onSubmit={handleValidation} noValidate>
        <CompanyForm company={company} handleChange={handleChange} validation={validation} />
      </form>
    </>
  );
};

export default CompanyUpdate;
