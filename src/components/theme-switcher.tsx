'use client';

import { Moon, Sun } from 'lucide-react';
import useColorScheme from '../contexts/useColorScheme';
import { ColorScheme } from '../interfaces/colorScheme';
import { useEffect } from 'react';

function ThemeSwitcher() {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const isDark = colorScheme !== ColorScheme.LIGHT;
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [colorScheme]);

  const onColorSchemeChange = () => {
    setColorScheme(
      colorScheme === ColorScheme.LIGHT ? ColorScheme.DARK : ColorScheme.LIGHT
    );
  };

  return (
    <div onClick={onColorSchemeChange}>
      {colorScheme === ColorScheme.LIGHT ? (
        <Sun className="mr-2 h-4 w-4" />
      ) : (
        <Moon className="mr-2 h-4 w-4" />
      )}
    </div>
  );
}
export default ThemeSwitcher;
