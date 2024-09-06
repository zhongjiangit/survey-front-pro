'use client';

import { createContext, PropsWithChildren, useContext } from 'react';
import { useMedia } from 'react-use';

export const TouchContext = createContext<boolean | undefined>(undefined);

export const TouchProvider = ({ children }: PropsWithChildren) => {
  const isTouch = useMedia('(pointer: coarse)', false);
  const isDesktop = useMedia('(min-width: 768px)', true);
  return (
    <TouchContext.Provider value={isTouch || !isDesktop}>
      {children}
    </TouchContext.Provider>
  );
};
export const useTouch = () => {
  const isTouch = useContext(TouchContext);
  return isTouch!;
};
