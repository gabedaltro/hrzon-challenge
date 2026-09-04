import React from 'react';
import { Button, styled } from '@mui/material';
import history from 'services/history';

const Container = styled('div')({
  display: 'flex',
  gap: 10,
});

type CompanyActionsProps = {
  saving: boolean;
  handleSubmit(): void;
};

const CompanyActions: React.FC<CompanyActionsProps> = ({ saving, handleSubmit }) => {
  return (
    <Container>
      <Button onClick={() => history.push('/companies')} disabled={saving}>
        Cancelar
      </Button>
      <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={saving}>
        Salvar
      </Button>
    </Container>
  );
};

export default CompanyActions;
