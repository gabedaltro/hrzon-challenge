import React, { useEffect, useRef } from 'react';
import { Grid, TextField } from '@mui/material';
import CompanyAutocomplete from 'components/autocomplete/CompanyAutocomplete';
import MoneyInput from 'components/masked-input/MoneyInput';
import { SelectableCompany } from 'types/company';
import { ProductPayload } from 'types/product';
import { ProductValidation } from './validation/productValidation';

type ProductFormProps = {
  product: ProductPayload;
  company: SelectableCompany | null;
  handleChange(index: keyof ProductPayload, value: string | number): void;
  handleChangeCompany(company: SelectableCompany | null): void;
  validation: ProductValidation;
};

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  company,
  handleChange,
  handleChangeCompany,
  validation,
}) => {
  const inputs = {
    company_id: useRef<HTMLInputElement>(null),
    name: useRef<HTMLInputElement>(null),
    internal_code: useRef<HTMLInputElement>(null),
    price: useRef<HTMLInputElement>(null),
    description: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const [key] = Object.keys(validation) as [keyof typeof inputs];

    if (!key || !inputs[key]) return;

    inputs[key].current?.focus();
  }, [validation]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <CompanyAutocomplete
          label="Empresa"
          onlySelectable
          value={company}
          handleChange={handleChangeCompany}
          inputRef={inputs.company_id}
          error={!!validation.company_id}
          helperText={validation.company_id ?? 'Apenas empresas ativas e não excluídas podem receber produtos'}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          inputRef={inputs.name}
          error={!!validation.name}
          helperText={validation.name}
          label="Nome"
          placeholder="Digite o nome do produto"
          fullWidth
          value={product.name}
          onChange={e => handleChange('name', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          inputRef={inputs.internal_code}
          error={!!validation.internal_code}
          helperText={validation.internal_code ?? 'Único dentro da empresa selecionada'}
          label="Código interno"
          placeholder="Ex.: SKU-001"
          fullWidth
          value={product.internal_code}
          onChange={e => handleChange('internal_code', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          inputRef={inputs.price}
          error={!!validation.price}
          helperText={validation.price}
          label="Preço"
          placeholder="R$ 0,00"
          fullWidth
          value={product.price}
          onChange={e => handleChange('price', e.target.value)}
          InputProps={{ inputComponent: MoneyInput as any }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          inputRef={inputs.description}
          error={!!validation.description}
          helperText={validation.description ?? 'Opcional, até 2.000 caracteres'}
          label="Descrição"
          placeholder="Descreva o produto"
          fullWidth
          multiline
          rows={4}
          value={product.description}
          onChange={e => handleChange('description', e.target.value)}
        />
      </Grid>

      <button type="submit" style={{ display: 'none' }} />
    </Grid>
  );
};

export default ProductForm;
