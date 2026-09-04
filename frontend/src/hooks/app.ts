import { createContext, useContext } from 'react';

export type AppContextData = {
  isMobile: boolean;
  windowWidth: number;
};

const AppContext = createContext<AppContextData>({} as AppContextData);

export function useApp(): AppContextData {
  const context = useContext(AppContext);
  return context;
}

export default AppContext;
