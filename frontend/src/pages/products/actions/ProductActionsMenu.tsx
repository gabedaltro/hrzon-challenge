import React, { ReactElement, useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { Block, CheckCircleOutline, DeleteForever, DeleteOutline, Edit, MoreHoriz, Restore } from '@mui/icons-material';
import history from 'services/history';
import { Product } from 'types/product';
import { useProduct } from '../hooks/useProduct';

type MenuOption = {
  key: string;
  label: string;
  icon: ReactElement;
  handleClick(): void;
};

type ProductActionsMenuProps = {
  product: Product;
};

/**
 * As ações vêm do bloco `permissions` calculado no servidor. Reativar, por exemplo, some
 * quando a empresa do produto está inativa ou excluída, que é justamente quando a regra recusaria.
 */
const ProductActionsMenu: React.FC<ProductActionsMenuProps> = ({ product }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { handleSelectAction } = useProduct();
  const { permissions } = product;

  const options: MenuOption[] = [];

  if (permissions.update) {
    options.push({
      key: 'update',
      label: 'Editar',
      icon: <Edit fontSize="small" />,
      handleClick: () => history.push(`/products/${product.id}`),
    });
  }

  if (permissions.inactivate) {
    options.push({
      key: 'inactivate',
      label: 'Inativar',
      icon: <Block fontSize="small" />,
      handleClick: () => handleSelectAction(product, 'inactivate'),
    });
  }

  if (permissions.reactivate) {
    options.push({
      key: 'reactivate',
      label: 'Reativar',
      icon: <CheckCircleOutline fontSize="small" />,
      handleClick: () => handleSelectAction(product, 'reactivate'),
    });
  }

  if (permissions.delete) {
    options.push({
      key: 'delete',
      label: 'Excluir',
      icon: <DeleteOutline fontSize="small" />,
      handleClick: () => handleSelectAction(product, 'delete'),
    });
  }

  if (permissions.restore) {
    options.push({
      key: 'restore',
      label: 'Restaurar',
      icon: <Restore fontSize="small" />,
      handleClick: () => handleSelectAction(product, 'restore'),
    });
  }

  if (permissions.force_delete) {
    options.push({
      key: 'force_delete',
      label: 'Excluir definitivamente',
      icon: <DeleteForever fontSize="small" color="error" />,
      handleClick: () => handleSelectAction(product, 'force_delete'),
    });
  }

  function handleOptionClick(option: MenuOption) {
    setAnchorEl(null);
    option.handleClick();
  }

  return (
    <>
      <Tooltip title={options.length ? 'Ações' : 'Nenhuma ação disponível'}>
        <span>
          <IconButton
            size="small"
            disabled={!options.length}
            aria-label={`Ações do produto ${product.name}`}
            onClick={e => setAnchorEl(e.currentTarget)}
          >
            <MoreHoriz />
          </IconButton>
        </span>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {options.map(option => (
          <MenuItem key={option.key} onClick={() => handleOptionClick(option)}>
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ProductActionsMenu;
