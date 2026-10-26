import { serve } from "@hono/node-server";
import { createApp } from "./app.js";

const apiKey = process.env["API_KEY"];
if (!apiKey) throw new Error("API_KEY is missing (see .env.example)");
const port = Number(process.env["PORT"] ?? 3000);
serve({ fetch: createApp(apiKey).fetch, port }, () => console.log(`API listening on http://localhost:${port}`));
