import { originMenus } from '@/components/common/side-nav/nav-links';
import { cloneDeep } from 'lodash';

export function getFirstMenu(currentRole: any) {
  const clonedMenus = cloneDeep(originMenus);
  const getMenus = (menus: any, currentRole: any) =>
    menus.filter((item: any) => {
      if (item.access.includes(currentRole?.key as string)) {
        if (item.children) {
          item.children = getMenus(item.children, currentRole);
        }
        return true;
      }
      return false;
    });
  const paths = getMenus(clonedMenus, currentRole);
  return paths[0]?.children ? paths[0]?.children[0]?.key : paths[0]?.key;
}
