import type { Order } from "./index.js";

export function startDelivery(order: Order) {
  const interval = setInterval(() => {
    if (order.stage === "preparing") {
      order.stage = "out-for-delivery";
      order.events.emit("progress");
    } else if (order.stage === "out-for-delivery") {
      order.stage = "delivered";
      order.events.emit("progress");
      clearInterval(interval);
    }
  }, 5000);
}
