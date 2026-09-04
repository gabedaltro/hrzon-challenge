import React from 'react';
import { InputAdornment, MenuItem, TextField, styled } from '@mui/material';
import { Search } from '@mui/icons-material';
import DisplayModeButtons from 'components/display-buttons/DisplayModeButtons';
import FilterBox from 'components/filter-box/FilterBox';
import { DisplayModeOptions } from 'hooks/useDisplayMode';
import { CompaniesFilter } from './hooks/useFetchCompanies';

const Filters = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr',
  alignItems: 'center',
  gap: 10,
  flex: 1,
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

type CompaniesFilterBoxProps = {
  filter: CompaniesFilter;
  handleChangeFilter(index: keyof CompaniesFilter, value: string): void;
  displayMode: DisplayModeOptions;
  setDisplayMode(mode: DisplayModeOptions): void;
};

const CompaniesFilterBox: React.FC<CompaniesFilterBoxProps> = ({
  filter,
  handleChangeFilter,
  displayMode,
  setDisplayMode,
}) => {
  return (
    <FilterBox>
      <Filters>
        <TextField
          label="Pesquisar por nome"
          placeholder="Digite o nome da empresa"
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
        <TextField
          select
          label="Status"
          value={filter.status}
          onChange={e => handleChangeFilter('status', e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="active">Ativas</MenuItem>
          <MenuItem value="inactive">Inativas</MenuItem>
        </TextField>
        <TextField
          select
          label="Registros excluídos"
          value={filter.trashed}
          onChange={e => handleChangeFilter('trashed', e.target.value)}
        >
          <MenuItem value="without">Ocultar excluídas</MenuItem>
          <MenuItem value="with">Incluir excluídas</MenuItem>
          <MenuItem value="only">Somente excluídas</MenuItem>
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

export default CompaniesFilterBox;
