import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

const json = (body: unknown, key = "secret") => ({ method: "POST", headers: { "content-type": "application/json", "x-api-key": key }, body: JSON.stringify(body) });

describe("API", () => {
  it("answers the health check", async () => {
    const res = await createApp("secret").request("/health");
    expect(res.status).toBe(200);
  });
  it("creates, reads, updates and deletes an item", async () => {
    const app = createApp("secret");
    const created = await (await app.request("/items", json({ name: "Website", price: 10 }))).json();
    expect(created.name).toBe("Website");
    expect((await app.request(`/items/${created.id}`)).status).toBe(200);
    const patched = await app.request(`/items/${created.id}`, { method: "PATCH", headers: { "content-type": "application/json", "x-api-key": "secret" }, body: JSON.stringify({ price: 12 }) });
    expect((await patched.json()).price).toBe(12);
    expect((await app.request(`/items/${created.id}`, { method: "DELETE", headers: { "x-api-key": "secret" } })).status).toBe(204);
    expect((await app.request(`/items/${created.id}`)).status).toBe(404);
  });
  it("refuses writes without the API key", async () => {
    expect((await createApp("secret").request("/items", json({ name: "x", price: 1 }, "wrong"))).status).toBe(401);
  });
  it("validates the body", async () => {
    expect((await createApp("secret").request("/items", json({ name: "", price: -1 }))).status).toBe(400);
  });
});
