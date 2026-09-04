import React from 'react';
import { Chip, styled } from '@mui/material';
import { Status } from 'types/status';

type Appearance = {
  label: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
};

const appearances: Record<'active' | 'inactive' | 'trashed', Appearance> = {
  active: {
    label: 'Ativo',
    color: '#125c37',
    backgroundColor: '#e3f5eb',
    borderColor: '#9dd7b8',
  },
  inactive: {
    label: 'Inativo',
    color: '#5a4300',
    backgroundColor: '#fdf5cc',
    borderColor: '#e6cf6a',
  },
  trashed: {
    label: 'Excluído',
    color: '#8a1c16',
    backgroundColor: '#fce9e8',
    borderColor: '#eba9a5',
  },
};

const CustomChip = styled(Chip)<{ appearance: Appearance }>(({ appearance }) => ({
  color: appearance.color,
  backgroundColor: appearance.backgroundColor,
  border: `1px solid ${appearance.borderColor}`,
  height: 24,
}));

type StatusChipProps = {
  /** Quando o registro está excluído logicamente, essa é a informação que domina a leitura. */
  trashed?: boolean;
  status?: Status;
};

/**
 * As duas dimensões do registro convivem: um registro excluído continua tendo status.
 * O chip mostra "Excluído" quando é o caso, e o status operacional no restante do tempo.
 */
const StatusChip: React.FC<StatusChipProps> = ({ trashed = false, status = 'active' }) => {
  const appearance = trashed ? appearances.trashed : appearances[status];

  return <CustomChip size="small" label={appearance.label} appearance={appearance} />;
};

export default StatusChip;
