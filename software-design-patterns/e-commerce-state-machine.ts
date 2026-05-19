type OrderState = "Draft" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
type LegalEvent =
  | "checkout"
  | "payment_received"
  | "dispatch"
  | "confirm_delivery"
  | "cancel";

const transitions: Record<
  OrderState,
  Partial<Record<LegalEvent, OrderState>>
> = {
  Draft: { payment_received: "Paid", cancel: "Cancelled" },
  Paid: { dispatch: "Shipped", cancel: "Cancelled" },
  Shipped: { confirm_delivery: "Delivered" },
  Delivered: {},
  Cancelled: {},
};

class Order {
  private state: OrderState = "Draft";

  transition(event: LegalEvent) {
    const next = transitions[this.state][event];
    if (!next)
      throw new Error(`Illegal transition: ${event} from ${this.state}`);
    this.state = next;
  }
}

const order1 = new Order();
order1.transition("payment_received");
order1.transition("dispatch");
order1.transition("confirm_delivery");

const order2 = new Order();
// order2.transition("dispatch");
order2.transition("cancel");
// order2.transition("dispatch");
// order2.transition("cancel");
