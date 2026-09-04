import React, { FormEvent, useState } from 'react';
import Loading from 'components/loading/Loading';
import PageHeader from 'components/page-header/PageHeader';
import { apiErrorMessage } from 'helpers/apiErrorMessage';
import { apiValidationErrors } from 'helpers/apiValidationErrors';
import { useMessaging } from 'hooks/messaging';
import { api } from 'services/api';
import history from 'services/history';
import { SelectableCompany } from 'types/company';
import { ProductPayload } from 'types/product';
import ProductActions from '../ProductActions';
import ProductForm from '../ProductForm';
import { ProductValidation, useProductValidation } from '../validation/productValidation';

const initialProduct: ProductPayload = {
  company_id: '',
  name: '',
  description: '',
  price: '',
  internal_code: '',
};

const ProductNew: React.FC = () => {
  const [product, setProduct] = useState<ProductPayload>(initialProduct);
  const [company, setCompany] = useState<SelectableCompany | null>(null);
  const [validation, setValidation, validate] = useProductValidation();
  const [saving, setSaving] = useState(false);
  const { handleOpen } = useMessaging();

  function handleChange(index: keyof ProductPayload, value: string | number) {
    setProduct(state => ({ ...state, [index]: value }));
  }

  function handleChangeCompany(company: SelectableCompany | null) {
    setCompany(company);
    handleChange('company_id', company ? company.id : '');
  }

  function handleValidation(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setValidation({});

    validate(product)
      .then(handleSubmit)
      .catch(() => {
        // O campo inválido já recebeu a mensagem e o foco pelo hook de validação.
      });
  }

  function handleSubmit() {
    setSaving(true);

    api
      .post('/products', product)
      .then(() => {
        handleOpen('Produto cadastrado.');
        history.push('/products');
      })
      .catch(err => {
        const errors = apiValidationErrors<ProductValidation>(err);

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
        title="Novo produto"
        description="Cadastro vinculado a uma empresa"
        backUrl="/products"
        ActionComponent={<ProductActions saving={saving} handleSubmit={handleValidation} />}
      />

      <form onSubmit={handleValidation} noValidate>
        <ProductForm
          product={product}
          company={company}
          handleChange={handleChange}
          handleChangeCompany={handleChangeCompany}
          validation={validation}
        />
      </form>
    </>
  );
};

export default ProductNew;
