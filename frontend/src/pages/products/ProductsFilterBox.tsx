import React, { useState } from 'react';
import { InputAdornment, MenuItem, TextField, styled } from '@mui/material';
import { Search } from '@mui/icons-material';
import CompanyAutocomplete from 'components/autocomplete/CompanyAutocomplete';
import DisplayModeButtons from 'components/display-buttons/DisplayModeButtons';
import FilterBox from 'components/filter-box/FilterBox';
import { DisplayModeOptions } from 'hooks/useDisplayMode';
import { SelectableCompany } from 'types/company';
import { ProductsFilter } from './hooks/useFetchProducts';

const Filters = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr',
  alignItems: 'center',
  gap: 10,
  flex: 1,
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr 1fr',
  },
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

type ProductsFilterBoxProps = {
  filter: ProductsFilter;
  handleChangeFilter(index: keyof ProductsFilter, value: string | number): void;
  displayMode: DisplayModeOptions;
  setDisplayMode(mode: DisplayModeOptions): void;
};

const ProductsFilterBox: React.FC<ProductsFilterBoxProps> = ({
  filter,
  handleChangeFilter,
  displayMode,
  setDisplayMode,
}) => {
  const [company, setCompany] = useState<SelectableCompany | null>(null);

  function handleChangeCompany(company: SelectableCompany | null) {
    setCompany(company);
    handleChangeFilter('company_id', company ? company.id : '');
  }

  return (
    <FilterBox>
      <Filters>
        <TextField
          label="Pesquisar por nome"
          placeholder="Digite o nome do produto"
          value={filter.name}
          onChange={e => handleChangeFilter('name', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <CompanyAutocomplete label="Empresa" value={company} handleChange={handleChangeCompany} />

        <TextField
          select
          label="Status"
          value={filter.status}
          onChange={e => handleChangeFilter('status', e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="active">Ativos</MenuItem>
          <MenuItem value="inactive">Inativos</MenuItem>
        </TextField>

        <TextField
          select
          label="Registros excluídos"
          value={filter.trashed}
          onChange={e => handleChangeFilter('trashed', e.target.value)}
        >
          <MenuItem value="without">Ocultar excluídos</MenuItem>
          <MenuItem value="with">Incluir excluídos</MenuItem>
          <MenuItem value="only">Somente excluídos</MenuItem>
        </TextField>
      </Filters>

      <DisplayModeButtons
        displayMode={displayMode}
        handleShowList={() => setDisplayMode('list')}
        handleShowModule={() => setDisplayMode('module')}
      />
    </FilterBox>
  );
};

export default ProductsFilterBox;
