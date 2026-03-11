import { apiFetch } from "@/lib/api";
import type { CategoryTreeItem } from "@/types/category-tree";

export async function fetchCategoriesTree(): Promise<CategoryTreeItem[]> {
  const data = await apiFetch<CategoryTreeItem[]>("/api/admin/categories/tree");
  return Array.isArray(data) ? data : [];
}

function findCategoryById(items: CategoryTreeItem[], id: number): CategoryTreeItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children?.length) {
      const found = findCategoryById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

export async function getCategoryNameById(id: number): Promise<string | null> {
  const tree = await fetchCategoriesTree();
  const found = findCategoryById(tree, id);
  return found?.name ?? null;
}
