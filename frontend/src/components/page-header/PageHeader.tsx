import React, { ReactElement } from 'react';
import { IconButton, Typography, styled } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import history from 'services/history';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 15,
  marginBottom: 20,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

const Content = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

type PageHeaderProps = {
  title: string;
  description?: string;
  backUrl?: string;
  ActionComponent?: ReactElement;
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, backUrl, ActionComponent }) => {
  return (
    <Container>
      <Content>
        {backUrl && (
          <IconButton size="small" aria-label="Voltar" onClick={() => history.push(backUrl)}>
            <ArrowBack />
          </IconButton>
        )}
        <div>
          <Typography variant="h6">{title}</Typography>
          {description && (
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          )}
        </div>
      </Content>
      {ActionComponent}
    </Container>
  );
};

export default PageHeader;
