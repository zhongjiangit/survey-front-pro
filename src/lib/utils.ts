import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function treeSelectToChecked(e: any) {
  if (e.__stop) {
    return;
  }
  let targetNode = e.target;
  while (targetNode) {
    if (targetNode?.classList.contains('ant-tree-node-content-wrapper')) {
      break;
    }
    if (targetNode?.contains(e.currentTarget)) {
      targetNode = null;
      break;
    }
    targetNode = targetNode.parentNode;
  }
  if (!targetNode) {
    return;
  }
  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  // @ts-ignore
  clickEvent.__stop = true;
  targetNode?.previousElementSibling?.dispatchEvent(clickEvent);
}
