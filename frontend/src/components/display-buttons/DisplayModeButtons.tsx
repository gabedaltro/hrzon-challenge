import React from 'react';
import { IconButton, Tooltip, styled } from '@mui/material';
import { ViewList, ViewModule } from '@mui/icons-material';
import { DisplayModeOptions } from 'hooks/useDisplayMode';

const Container = styled('div')(({ theme }) => ({
  minWidth: 80,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

type DisplayModeButtonsProps = {
  displayMode: DisplayModeOptions;
  handleShowList(): void;
  handleShowModule(): void;
};

const DisplayModeButtons: React.FC<DisplayModeButtonsProps> = ({ displayMode, handleShowList, handleShowModule }) => {
  return (
    <Container>
      <Tooltip title="Ver em tabela">
        <IconButton onClick={handleShowList} aria-label="Ver em tabela">
          <ViewList color={displayMode === 'list' ? 'primary' : 'disabled'} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Ver em cards">
        <IconButton onClick={handleShowModule} aria-label="Ver em cards">
          <ViewModule color={displayMode === 'module' ? 'primary' : 'disabled'} />
        </IconButton>
      </Tooltip>
    </Container>
  );
};

export default DisplayModeButtons;
