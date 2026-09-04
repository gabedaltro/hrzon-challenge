import React from 'react';
import { Typography, styled } from '@mui/material';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  flex: 1,
  padding: '60px 20px',
});

type NoDataProps = {
  message: string;
  description?: string;
};

const NoData: React.FC<NoDataProps> = ({ message, description }) => {
  return (
    <Container>
      <Typography color="textSecondary">{message}</Typography>
      {description && (
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      )}
    </Container>
  );
};

export default NoData;
