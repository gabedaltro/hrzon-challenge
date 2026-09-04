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
import ProductsFilterBox from './ProductsFilterBox';
import { ProductProvider } from './hooks/useProduct';
import { useProductActions } from './hooks/useProductActions';
import { useFetchProducts } from './hooks/useFetchProducts';
import ProductListModule from './list/module/ProductListModule';
import ProductListTable from './list/table/ProductListTable';
import { productsTableTemplate } from './template/productsTableTemplate';

const Products: React.FC = () => {
  const [displayMode, setDisplayMode] = useDisplayMode();
  const {
    products,
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
  } = useFetchProducts();
  const { copy, saving, handleSelectAction, handleCloseAction, handleConfirmAction } = useProductActions(refresh);

  return (
    <ProductProvider value={{ handleSelectAction }}>
      {saving && <Loading />}

      <PageHeader
        title="Produtos"
        description="Produtos vinculados aos fornecedores"
        ActionComponent={
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => history.push('/products/new')}
          >
            Novo produto
          </Button>
        }
      />

      <TableContainer tableTemplate={productsTableTemplate}>
        <ProductsFilterBox
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
        ) : products.length === 0 ? (
          <NoData
            message="Nenhum produto encontrado"
            description="Revise os filtros da listagem ou cadastre um novo produto."
          />
        ) : displayMode === 'list' ? (
          <ProductListTable products={products} order={order} handleSort={handleSort} />
        ) : (
          <ProductListModule products={products} />
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
    </ProductProvider>
  );
};

export default Products;
