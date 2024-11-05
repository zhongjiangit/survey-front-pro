'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import useColorScheme from '../../contexts/useColorScheme';
import { ColorScheme } from '../../interfaces/ColorScheme';
import { useLongPress } from 'react-use';
import { useTouch } from '../display/hybrid';
import {
  DeveloperFlags,
  useGlobalSettingsStore,
} from '@/contexts/useGlobalSettingsStore';

function ThemeSwitcher() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isTouch = useTouch();
  const developerFlags = useGlobalSettingsStore(state => state.developerFlags);
  const setDeveloperFlags = useGlobalSettingsStore(
    state => state.setDeveloperFlags
  );

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
    // 重新渲染页面
    window.location.reload();
  };

  const longPressEvent = useLongPress(
    (event: TouchEvent | MouseEvent) => {
      if (isTouch || event.metaKey) {
        console.log('toggle dev-tools after long pressing');
        if (developerFlags) {
          setDeveloperFlags(DeveloperFlags.NONE);
        } else {
          setDeveloperFlags(DeveloperFlags.NORMAL);
        }
      }
    },
    {
      isPreventDefault: true,
      delay: 1000,
    }
  );

  return (
    <div
      className="cursor-pointer hover:animate-pulse"
      onClick={onColorSchemeChange}
      {...longPressEvent}
    >
      {colorScheme === ColorScheme.LIGHT ? (
        <Sun className="mr-2 h-6 w-6" />
      ) : (
        <Moon className="mr-2 h-6 w-6" />
      )}
    </div>
  );
}
export default ThemeSwitcher;
