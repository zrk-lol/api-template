import { randomUUID } from "node:crypto";

export type Item = { id: string; name: string; price: number; createdAt: string };

/** In-memory store: replace it with your database, the routes do not change. */
export function createStore() {
  const items = new Map<string, Item>();
  return {
    list: () => [...items.values()],
    get: (id: string) => items.get(id),
    create: (data: { name: string; price: number }) => {
      const item = { id: randomUUID(), ...data, createdAt: new Date().toISOString() };
      items.set(item.id, item);
      return item;
    },
    update: (id: string, data: Partial<{ name: string; price: number }>) => {
      const item = items.get(id);
      if (!item) return undefined;
      const next = { ...item, ...data };
      items.set(id, next);
      return next;
    },
    remove: (id: string) => items.delete(id),
  };
}
