import type { Order } from "./index.js";

export function startDelivery(order: Order) {
  const interval = setInterval(() => {
    if (order.stage === "preparing") {
      order.stage = "out-for-delivery";
    } else if (order.stage === "out-for-delivery") {
      order.stage = "delivered";
      clearInterval(interval);
    }
  }, 5000);
}
