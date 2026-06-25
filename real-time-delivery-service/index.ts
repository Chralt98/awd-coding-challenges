import express from "express";
import path from "path";
import { startDelivery } from "./startDelivery.ts";

export type Stage = "preparing" | "out-for-delivery" | "delivered";

export type Order = {
  id: string;
  stage: Stage;
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

app.post("/api/orders", (req, res) => {
  const order: Order = {
    id: crypto.randomUUID(),
    stage: "preparing",
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
