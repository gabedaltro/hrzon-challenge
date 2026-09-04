import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';
import Messaging, { MessagingSeverity } from 'components/messaging/Messaging';

type MessagingContextData = {
  handleOpen(message: string, severity?: MessagingSeverity): void;
  handleClose(): void;
};

const MessagingContext = createContext<MessagingContextData>({} as MessagingContextData);

type MessagingProviderProps = {
  children: ReactNode;
};

const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<MessagingSeverity>('success');

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback((message: string, severity: MessagingSeverity = 'success') => {
    setOpen(false);

    // Reabre em seguida para que duas mensagens seguidas não passem despercebidas.
    setTimeout(() => {
      setMessage(message);
      setSeverity(severity);
      setOpen(true);
    }, 150);
  }, []);

  return (
    <MessagingContext.Provider value={{ handleOpen, handleClose }}>
      {children}
      <Messaging open={open} message={message} severity={severity} handleClose={handleClose} />
    </MessagingContext.Provider>
  );
};

export function useMessaging(): MessagingContextData {
  const context = useContext(MessagingContext);

  if (!context) throw new Error('useMessaging deve ser usado dentro do MessagingProvider');

  return context;
}

export default MessagingProvider;
