import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findPageItem(
  items: DocsItem[],
  path: string
): DocsItem | undefined {
  for (const item of items) {
    if (item.path === path) {
      return item;
    }

    if (item.children) {
      const found = findPageItem(item.children as DocsItem[], path);
      if (found) {
        return found;
      }
    }
  }
}
