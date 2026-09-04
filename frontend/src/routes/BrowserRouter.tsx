import React, { ReactNode, useLayoutEffect, useState } from 'react';
import { Action, BrowserHistory, Location } from 'history';
import { Router } from 'react-router-dom';

type BrowserRouterProps = {
  children: ReactNode;
  history: BrowserHistory;
};

type BrowserRouterState = {
  action: Action;
  location: Location;
};

/**
 * Router ligado à instância de history exportada em `services/history`, para que a navegação
 * também funcione fora dos componentes (depois de salvar um formulário, por exemplo).
 */
export const BrowserRouter: React.FC<BrowserRouterProps> = ({ children, history }) => {
  const [state, setState] = useState<BrowserRouterState>({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router location={state.location} navigationType={state.action} navigator={history}>
      {children}
    </Router>
  );
};
