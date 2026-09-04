import React from 'react';
import { Alert, Snackbar } from '@mui/material';

export type MessagingSeverity = 'success' | 'error' | 'info';

type MessagingProps = {
  open: boolean;
  message: string;
  severity: MessagingSeverity;
  handleClose(): void;
};

const Messaging: React.FC<MessagingProps> = ({ open, message, severity, handleClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={severity === 'error' ? 8000 : 4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ maxWidth: 520 }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Messaging;
