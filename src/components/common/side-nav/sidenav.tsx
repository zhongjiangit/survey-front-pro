import { cn } from '@/lib/utils';
import NavLinks from './nav-links';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div
        className={cn(
          'fixed w-full bottom-0 left-0 grid grid-cols-4 space-x-2 opacity-100 z-50',
          'md:relative md:flex md:grow md:justify-between md:flex-col md:space-x-0 md:space-y-2'
        )}
      >
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 dark:bg-gray-900 md:block"></div>
      </div>
    </div>
  );
}
