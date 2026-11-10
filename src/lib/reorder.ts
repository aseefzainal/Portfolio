/** Move an item within a list, then reindex `position`. */
export function moveItem<T extends { id: number; position: number }>(
  items: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return items;
  }
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next.map((item, index) => ({ ...item, position: index }));
}

/**
 * Reorder only the visible subset (e.g. showOnResume), keeping hidden items
 * in their relative slots within the full list.
 */
export function moveVisibleItem<T extends { id: number; position: number }>(
  all: T[],
  visible: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (visible.length === 0) return all;
  const order = visible.map((item) => item.id);
  const nextOrder = moveItem(
    order.map((id, position) => ({ id, position })),
    fromIndex,
    toIndex,
  ).map((item) => item.id);

  const byId = new Map(all.map((item) => [item.id, item]));
  const visibleSet = new Set(order);
  let cursor = 0;
  const merged = all.map((item) => {
    if (!visibleSet.has(item.id)) return item;
    const id = nextOrder[cursor];
    cursor += 1;
    return byId.get(id) ?? item;
  });
  return merged.map((item, index) => ({ ...item, position: index }));
}
