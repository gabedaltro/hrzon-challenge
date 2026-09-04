import React from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  /** Aviso destacado, usado quando a ação não tem volta. */
  warning?: string;
  confirmLabel?: string;
  danger?: boolean;
  handleConfirm(): void;
  handleClose(): void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  warning,
  confirmLabel = 'Confirmar',
  danger = false,
  handleConfirm,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {warning && (
          <Alert severity="warning" sx={{ marginTop: 2 }}>
            {warning}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={danger ? 'error' : 'secondary'}
          disableElevation
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
