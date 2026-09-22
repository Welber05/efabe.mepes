import { MenuItem } from '../types';

export const MAX_MENU_LEVEL = 5;

export function menuChildren(items: MenuItem[], parentId?: string, visibleOnly = false): MenuItem[] {
  return items
    .filter((item) => (item.parentId || '') === (parentId || '') && (!visibleOnly || item.visible))
    .sort((a, b) => a.order - b.order);
}

export function menuDepth(items: MenuItem[], id: string): number {
  let depth = 0;
  let current = items.find((item) => item.id === id);
  const seen = new Set<string>();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    depth++;
    current = items.find((item) => item.id === current?.parentId);
  }
  return depth;
}

export function menuDescendantIds(items: MenuItem[], id: string): Set<string> {
  const descendants = new Set<string>();
  const visit = (parentId: string) => {
    for (const child of menuChildren(items, parentId)) {
      if (descendants.has(child.id)) continue;
      descendants.add(child.id);
      visit(child.id);
    }
  };
  visit(id);
  return descendants;
}

export function menuSubtreeDepth(items: MenuItem[], id: string): number {
  const children = menuChildren(items, id);
  return 1 + (children.length ? Math.max(...children.map((child) => menuSubtreeDepth(items, child.id))) : 0);
}
