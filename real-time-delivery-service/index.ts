import express from "express";
import path from "path";
import { EventEmitter } from "node:events";
import { startDelivery } from "./startDelivery.ts";

export type Stage = "preparing" | "out-for-delivery" | "delivered";

export type Order = {
  id: string;
  stage: Stage;
  events: EventEmitter;
};

const app = express();
const orders = new Map<string, Order>();

app.get("/", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "client.html"));
});

app.get("/api/orders/:id", (req, res) => {
  const order = orders.get(req.params.id);

  if (!order) {
    res.status(404).json({ error: "unknown order" });
    return;
  }

  res.json({
    stage: order.stage,
  });
});

app.get("/api/orders/:id/updates", (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    res.status(404).json({ error: "unknown order" });
    return;
  }

  const lastStage = req.query.lastStage as Stage | undefined;
  if (order.stage !== lastStage) {
    res.json({ stage: order.stage });
    return;
  }

  const onProgress = () => {
    clearTimeout(timer);
    res.json({ stage: order.stage });
  };
  order.events.once("progress", onProgress);

  const timer = setTimeout(() => {
    order.events.off("progress", onProgress);
    res.json({ stage: order.stage });
  }, 25_000);

  req.on("close", () => {
    clearTimeout(timer);
    order.events.off("progress", onProgress);
  });
});

app.post("/api/orders", (req, res) => {
  const order: Order = {
    id: crypto.randomUUID(),
    stage: "preparing",
    events: new EventEmitter(),
  };

  orders.set(order.id, order);
  startDelivery(order);

  res.status(201).json({
    id: order.id,
  });
});

app.listen(3000, () =>
  console.log("Server running on port 3000: http://localhost:3000"),
);
