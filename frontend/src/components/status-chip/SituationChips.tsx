import React from 'react';
import { styled } from '@mui/material';
import { Status } from 'types/status';
import StatusChip from './StatusChip';

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexWrap: 'wrap',
});

type SituationChipsProps = {
  status: Status;
  trashed: boolean;
};

/**
 * Status operacional e exclusão lógica são dimensões independentes: um registro pode estar
 * inativo e excluído ao mesmo tempo, e a listagem precisa mostrar as duas coisas.
 */
const SituationChips: React.FC<SituationChipsProps> = ({ status, trashed }) => {
  return (
    <Container>
      <StatusChip status={status} />
      {trashed && <StatusChip trashed />}
    </Container>
  );
};

export default SituationChips;
