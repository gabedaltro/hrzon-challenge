import React, { Ref } from 'react';
import { Autocomplete, CircularProgress, InputAdornment, TextField } from '@mui/material';
import { useCompanyOptions } from 'hooks/useCompanyOptions';
import { SelectableCompany } from 'types/company';

type CompanyAutocompleteProps = {
  label: string;
  value: SelectableCompany | null;
  handleChange(company: SelectableCompany | null): void;
  /** Só as empresas aptas a receber vínculo — usado no cadastro de produto. */
  onlySelectable?: boolean;
  error?: boolean;
  helperText?: string;
  inputRef?: Ref<HTMLInputElement>;
};

const CompanyAutocomplete: React.FC<CompanyAutocompleteProps> = ({
  label,
  value,
  handleChange,
  onlySelectable = false,
  error,
  helperText,
  inputRef,
}) => {
  const { options, loading, search, setSearch } = useCompanyOptions({ onlySelectable });

  return (
    <Autocomplete
      options={options}
      value={value}
      loading={loading}
      onChange={(_, company) => handleChange(company)}
      inputValue={value ? value.name : search}
      onInputChange={(_, inputValue, reason) => {
        if (reason === 'input') setSearch(inputValue);
        if (reason === 'clear') setSearch('');
      }}
      getOptionLabel={option => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText={onlySelectable ? 'Nenhuma empresa apta encontrada' : 'Nenhuma empresa encontrada'}
      loadingText="Carregando..."
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <div>
            <div>{option.name}</div>
            <small>{option.cnpj_formatted}</small>
          </div>
        </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          inputRef={inputRef}
          label={label}
          placeholder="Digite para pesquisar"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && (
                  <InputAdornment position="end">
                    <CircularProgress size={16} />
                  </InputAdornment>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default CompanyAutocomplete;
