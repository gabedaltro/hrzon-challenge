import React, { FormEvent, useEffect, useState } from 'react';
import { Alert } from '@mui/material';
import InsideLoading from 'components/loading/InsideLoading';
import Loading from 'components/loading/Loading';
import PageHeader from 'components/page-header/PageHeader';
import { apiErrorMessage } from 'helpers/apiErrorMessage';
import { apiValidationErrors } from 'helpers/apiValidationErrors';
import { useMessaging } from 'hooks/messaging';
import { useParams } from 'react-router-dom';
import { api } from 'services/api';
import history from 'services/history';
import { SelectableCompany } from 'types/company';
import { Product, ProductPayload } from 'types/product';
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

const ProductUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductPayload>(initialProduct);
  const [company, setCompany] = useState<SelectableCompany | null>(null);
  const [loaded, setLoaded] = useState<Product | null>(null);
  const [validation, setValidation, validate] = useProductValidation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { handleOpen } = useMessaging();

  useEffect(() => {
    api
      .get<{ data: Product }>(`/products/${id}`)
      .then(response => {
        const data = response.data.data;

        setLoaded(data);
        setProduct({
          company_id: data.company_id,
          name: data.name,
          description: data.description ?? '',
          price: data.price,
          internal_code: data.internal_code,
        });

        // A empresa só é pré-selecionada quando ainda está apta: se estiver inativa ou
        // excluída, o vínculo precisa ser refeito para que a edição seja aceita.
        if (data.company && !data.company.is_trashed && data.company.status === 'active') {
          setCompany({ id: data.company.id, name: data.company.name, cnpj_formatted: '' });
        }
      })
      .catch(err => {
        setError(apiErrorMessage(err, 'Não foi possível carregar o produto.'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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
      .put(`/products/${id}`, product)
      .then(() => {
        handleOpen('Produto atualizado.');
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

  if (loading) return <InsideLoading />;

  if (error) return <Alert severity="error">{error}</Alert>;

  const companyUnavailable = !!loaded?.company && (loaded.company.is_trashed || loaded.company.status === 'inactive');

  return (
    <>
      {saving && <Loading />}

      <PageHeader
        title="Editar produto"
        description={loaded?.name}
        backUrl="/products"
        ActionComponent={<ProductActions saving={saving} handleSubmit={handleValidation} />}
      />

      {companyUnavailable && (
        <Alert severity="warning" sx={{ marginBottom: 2 }}>
          A empresa {loaded?.company?.name} está {loaded?.company?.is_trashed ? 'excluída' : 'inativa'} e não pode mais
          receber produtos. Para salvar, selecione uma empresa ativa.
        </Alert>
      )}

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

export default ProductUpdate;
