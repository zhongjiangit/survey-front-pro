import { originMenus } from '@/components/common/side-nav/nav-links';

/**
 * 获取用户菜单
 * @param currentRole
 */
export function getMenus(currentRole: any) {
  const getMenus = (menus: any, currentRole: any) =>
    menus
      .map((item: any) => {
        item = { ...item };
        if (item.access.includes(currentRole?.key as string)) {
          if (item.children) {
            item.children = getMenus(item.children, currentRole);
          }
          return item;
        }
      })
      .filter((t: any) => t);
  return getMenus(originMenus, currentRole);
}

/**
 * 获取第一个菜单
 * @param currentRole
 */
export function getFirstMenu(currentRole: any) {
  const paths = getMenus(currentRole);
  return paths[0]?.children ? paths[0]?.children[0]?.key : paths[0]?.key;
}

/**
 * 获取第一个菜单
 * @param menus
 */
export function getFirstMenuByMenus(menus: any[]) {
  return menus[0]?.children ? menus[0]?.children[0]?.key : menus[0]?.key;
}

/**
 * 判断菜单是否存在
 * 1 是否有访问权限
 * @param menus
 * @param pathName
 */
export function hasMenu(menus: any[], pathName: string) {
  return !!selectMenu(menus, pathName);
}

export function selectMenu(menus: any[], pathName: string) {
  return find(menus, pathName);
  function find(menus: any, pathName: string) {
    if (!menus) {
      return;
    }
    for (let menu of menus) {
      // 匹配菜单 有父菜单权限也可以
      if (
        menu.allowChildren
          ? pathName.startsWith(menu.key)
          : menu.key === pathName
      ) {
        return menu;
      }
      if ((menu = find(menu.children, pathName))) {
        return menu;
      }
    }
  }
}
