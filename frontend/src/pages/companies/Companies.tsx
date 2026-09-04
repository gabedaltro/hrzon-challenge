import React from 'react';
import { Alert, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import ConfirmDialog from 'components/confirm-dialog/ConfirmDialog';
import Loading from 'components/loading/Loading';
import ModuleLoading from 'components/loading/ModuleLoading';
import TableLoading from 'components/loading/TableLoading';
import NoData from 'components/no-data/NoData';
import PageHeader from 'components/page-header/PageHeader';
import Pagination from 'components/pagination/Pagination';
import TableContainer from 'components/table/TableContainer';
import { useDisplayMode } from 'hooks/useDisplayMode';
import history from 'services/history';
import CompaniesFilterBox from './CompaniesFilterBox';
import { CompanyProvider } from './hooks/useCompany';
import { useCompanyActions } from './hooks/useCompanyActions';
import { useFetchCompanies } from './hooks/useFetchCompanies';
import CompanyListModule from './list/module/CompanyListModule';
import CompanyListTable from './list/table/CompanyListTable';
import { companiesTableTemplate } from './template/companiesTableTemplate';

const Companies: React.FC = () => {
  const [displayMode, setDisplayMode] = useDisplayMode();
  const {
    companies,
    filter,
    handleChangeFilter,
    order,
    handleSort,
    page,
    setPage,
    rowsPerPage,
    handleSetRowsPerPage,
    total,
    loading,
    error,
    refresh,
  } = useFetchCompanies();
  const { copy, saving, handleSelectAction, handleCloseAction, handleConfirmAction } = useCompanyActions(refresh);

  return (
    <CompanyProvider value={{ handleSelectAction }}>
      {saving && <Loading />}

      <PageHeader
        title="Empresas"
        description="Fornecedores cadastrados e seus produtos vinculados"
        ActionComponent={
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => history.push('/companies/new')}
          >
            Nova empresa
          </Button>
        }
      />

      <TableContainer tableTemplate={companiesTableTemplate}>
        <CompaniesFilterBox
          filter={filter}
          handleChangeFilter={handleChangeFilter}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
        />

        {loading ? (
          displayMode === 'list' ? (
            <TableLoading />
          ) : (
            <ModuleLoading />
          )
        ) : error ? (
          <Alert severity="error" sx={{ margin: 2 }}>
            {error}
          </Alert>
        ) : companies.length === 0 ? (
          <NoData
            message="Nenhuma empresa encontrada"
            description="Revise os filtros da listagem ou cadastre uma nova empresa."
          />
        ) : displayMode === 'list' ? (
          <CompanyListTable companies={companies} order={order} handleSort={handleSort} />
        ) : (
          <CompanyListModule companies={companies} />
        )}

        {total > 0 && (
          <Pagination
            count={total}
            page={page}
            rowsPerPage={rowsPerPage}
            handleSetPage={setPage}
            handleSetRowsPerPage={handleSetRowsPerPage}
          />
        )}
      </TableContainer>

      {copy && (
        <ConfirmDialog
          open
          title={copy.title}
          description={copy.description}
          warning={copy.warning}
          confirmLabel={copy.confirmLabel}
          danger={copy.danger}
          handleConfirm={handleConfirmAction}
          handleClose={handleCloseAction}
        />
      )}
    </CompanyProvider>
  );
};

export default Companies;
