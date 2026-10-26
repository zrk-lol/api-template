import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { createStore } from "./store.js";

const itemInput = z.object({ name: z.string().min(1).max(120), price: z.number().nonnegative() });

/** The API, built as a function so tests can create a fresh one. */
export function createApp(apiKey: string, store = createStore()) {
  const app = new Hono();
  app.use("*", cors());

  // Reads are public; writes need the API key.
  app.use("/items/*", async (c, next) => {
    if (c.req.method !== "GET" && c.req.header("x-api-key") !== apiKey) throw new HTTPException(401, { message: "Missing or wrong API key" });
    await next();
  });

  app.get("/health", (c) => c.json({ status: "ok", time: new Date().toISOString() }));
  app.get("/items", (c) => c.json(store.list()));
  app.get("/items/:id", (c) => {
    const item = store.get(c.req.param("id"));
    return item ? c.json(item) : c.json({ error: "Not found" }, 404);
  });
  app.post("/items", async (c) => {
    const parsed = itemInput.safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "Invalid body", issues: parsed.error.issues }, 400);
    return c.json(store.create(parsed.data), 201);
  });
  app.patch("/items/:id", async (c) => {
    const parsed = itemInput.partial().safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return c.json({ error: "Invalid body", issues: parsed.error.issues }, 400);
    const item = store.update(c.req.param("id"), parsed.data);
    return item ? c.json(item) : c.json({ error: "Not found" }, 404);
  });
  app.delete("/items/:id", (c) => (store.remove(c.req.param("id")) ? c.body(null, 204) : c.json({ error: "Not found" }, 404)));

  app.onError((error, c) => {
    if (error instanceof HTTPException) return c.json({ error: error.message }, error.status);
    console.error(error);
    return c.json({ error: "Internal error" }, 500);
  });
  return app;
}
