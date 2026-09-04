import React, { ReactElement, useState } from 'react';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { Block, CheckCircleOutline, DeleteForever, DeleteOutline, Edit, MoreHoriz, Restore } from '@mui/icons-material';
import history from 'services/history';
import { Company } from 'types/company';
import { useCompany } from '../hooks/useCompany';

type MenuOption = {
  key: string;
  label: string;
  icon: ReactElement;
  handleClick(): void;
};

type CompanyActionsMenuProps = {
  company: Company;
};

/**
 * O menu só monta as ações que o servidor marcou como permitidas para o registro,
 * então o usuário nunca escolhe algo que a regra vai recusar depois.
 */
const CompanyActionsMenu: React.FC<CompanyActionsMenuProps> = ({ company }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { handleSelectAction } = useCompany();
  const { permissions } = company;

  const options: MenuOption[] = [];

  if (permissions.update) {
    options.push({
      key: 'update',
      label: 'Editar',
      icon: <Edit fontSize="small" />,
      handleClick: () => history.push(`/companies/${company.id}`),
    });
  }

  if (permissions.inactivate) {
    options.push({
      key: 'inactivate',
      label: 'Inativar',
      icon: <Block fontSize="small" />,
      handleClick: () => handleSelectAction(company, 'inactivate'),
    });
  }

  if (permissions.reactivate) {
    options.push({
      key: 'reactivate',
      label: 'Reativar',
      icon: <CheckCircleOutline fontSize="small" />,
      handleClick: () => handleSelectAction(company, 'reactivate'),
    });
  }

  if (permissions.delete) {
    options.push({
      key: 'delete',
      label: 'Excluir',
      icon: <DeleteOutline fontSize="small" />,
      handleClick: () => handleSelectAction(company, 'delete'),
    });
  }

  if (permissions.restore) {
    options.push({
      key: 'restore',
      label: 'Restaurar',
      icon: <Restore fontSize="small" />,
      handleClick: () => handleSelectAction(company, 'restore'),
    });
  }

  if (permissions.force_delete) {
    options.push({
      key: 'force_delete',
      label: 'Excluir definitivamente',
      icon: <DeleteForever fontSize="small" color="error" />,
      handleClick: () => handleSelectAction(company, 'force_delete'),
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
            aria-label={`Ações da empresa ${company.name}`}
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

export default CompanyActionsMenu;
