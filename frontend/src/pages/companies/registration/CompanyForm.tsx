import React, { useEffect, useRef } from 'react';
import { Grid, TextField } from '@mui/material';
import { cnpjMask } from 'helpers/cnpjMask';
import { phoneMask } from 'helpers/phoneMask';
import { CompanyPayload } from 'types/company';
import { CompanyValidation } from './validation/companyValidation';

type CompanyFormProps = {
  company: CompanyPayload;
  handleChange(index: keyof CompanyPayload, value: string): void;
  validation: CompanyValidation;
};

const CompanyForm: React.FC<CompanyFormProps> = ({ company, handleChange, validation }) => {
  const inputs = {
    name: useRef<HTMLInputElement>(null),
    cnpj: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    const [key] = Object.keys(validation) as [keyof typeof inputs];

    if (!key || !inputs[key]) return;

    inputs[key].current?.focus();
  }, [validation]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <TextField
          inputRef={inputs.name}
          error={!!validation.name}
          helperText={validation.name}
          label="Nome"
          placeholder="Digite o nome da empresa"
          fullWidth
          autoFocus
          value={company.name}
          onChange={e => handleChange('name', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          inputRef={inputs.cnpj}
          error={!!validation.cnpj}
          helperText={validation.cnpj}
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          fullWidth
          value={company.cnpj}
          onChange={e => handleChange('cnpj', cnpjMask(e.target.value))}
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <TextField
          inputRef={inputs.email}
          error={!!validation.email}
          helperText={validation.email}
          label="E-mail"
          placeholder="contato@empresa.com.br"
          fullWidth
          value={company.email}
          onChange={e => handleChange('email', e.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          inputRef={inputs.phone}
          error={!!validation.phone}
          helperText={validation.phone}
          label="Telefone"
          placeholder="(00) 00000-0000"
          fullWidth
          value={company.phone}
          onChange={e => handleChange('phone', phoneMask(e.target.value))}
        />
      </Grid>

      <button type="submit" style={{ display: 'none' }} />
    </Grid>
  );
};

export default CompanyForm;
