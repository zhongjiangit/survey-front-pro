'use client';

import Cookies from 'js-cookie';
import React, { useContext } from 'react';
import { createStore, useStore } from 'zustand';
import { ColorScheme } from '../interfaces/colorScheme';

interface ColorSchemeProps {
  colorScheme: ColorScheme;
}

interface ColorSchemeState extends ColorSchemeProps {
  setColorScheme: (colorScheme: ColorScheme) => void;
}

type ColorSchemeStore = ReturnType<typeof createColorSchemeStore>;

export const createColorSchemeStore = (
  initialProps?: Pick<ColorSchemeState, 'colorScheme'>
) => {
  const defaultProps: ColorSchemeProps = {
    colorScheme: ColorScheme.LIGHT,
  };
  return createStore<ColorSchemeState>()(set => ({
    ...defaultProps,
    ...initialProps,
    setColorScheme: (colorScheme: ColorScheme) => {
      set({ colorScheme });
      Cookies.set('color-scheme', colorScheme);
    },
  }));
};

export const ColorSchemeContext = React.createContext<ColorSchemeStore | null>(
  null
);

/**
 * useColorScheme
 */
export default function useColorScheme() {
  const store = useContext(ColorSchemeContext)!;
  return useStore(store);
}
