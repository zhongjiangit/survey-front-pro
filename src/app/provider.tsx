'use client';

import { ReactNode, useRef } from 'react';
import { TouchProvider } from '../components/display/hybrid';
import {
  ColorSchemeContext,
  createColorSchemeStore,
} from '../contexts/useColorScheme';
import { ColorScheme } from '../interfaces/colorScheme';

interface Props {
  colorScheme: ColorScheme;
  children: ReactNode;
}

export function Provider({ colorScheme, children }: Props) {
  const store = useRef(createColorSchemeStore({ colorScheme })).current;
  // useEffect(() => {
  //   const classNames = [
  //     ethereumNetwork.testnet ? 'testnet' : 'mainnet',
  //     ethereumNetwork.network,
  //   ];
  //   document.documentElement.classList.add(...classNames);
  //   return () => {
  //     document.documentElement.classList.remove(...classNames);
  //   };
  // }, [ethereumNetwork.network]);
  return (
    <ColorSchemeContext.Provider value={store}>
      <TouchProvider>{children}</TouchProvider>
    </ColorSchemeContext.Provider>
  );
}
