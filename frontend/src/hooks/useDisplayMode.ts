import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from './app';

export type DisplayModeOptions = 'list' | 'module';

type UseDisplayMode = [DisplayModeOptions, Dispatch<SetStateAction<DisplayModeOptions>>];

/** Em telas estreitas a tabela não cabe, então a listagem cai para os cards. */
export function useDisplayMode(): UseDisplayMode {
  const { isMobile, windowWidth } = useApp();
  const [displayMode, setDisplayMode] = useState<DisplayModeOptions>(isMobile || windowWidth < 960 ? 'module' : 'list');

  useEffect(() => {
    setDisplayMode(isMobile || windowWidth < 960 ? 'module' : 'list');
  }, [isMobile, windowWidth]);

  return [displayMode, setDisplayMode];
}
