import React from 'react';
import { CircularProgress, styled } from '@mui/material';

const Container = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1400,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(247, 247, 247, 0.6)',
});

/** Bloqueia a tela enquanto uma ação está sendo gravada. */
const Loading: React.FC = () => {
  return (
    <Container role="progressbar" aria-label="Salvando">
      <CircularProgress color="primary" />
    </Container>
  );
};

export default Loading;
