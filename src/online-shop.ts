import type { Product, Customer } from "../online-shop-types.js";
import type { Order, LineItem } from "../online-shop-order.js";

function orderTotal(order: Order): number {
  return order.lineItems
    .map((i) => i.product.priceEuro * i.product.stock)
    .reduce((sum, current) => sum + current, 0);
}
function formatOrder(order: Order): string {
  return `Customer id: ${order.customer.id}, 
  name: ${order.customer.name}, email: ${order.customer.email}, 
  status is ${order.status}; line items: ${order.lineItems
    .map(
      (l) =>
        " Product id: " +
        l.product.id +
        ", name: " +
        l.product.name +
        ", price: " +
        l.product.priceEuro +
        ", stock:" +
        l.product.stock +
        `, quantity: ` +
        l.quantity,
    )
    .join(", ")}`;
}
function isInStock(product: Product): boolean {
  return product.stock > 0;
}

let customer: Customer = {
  id: "CID-1",
  name: "Chris",
  email: "chris@email.com",
};
let product: Product = {
  id: "PID-1",
  name: "Guitar",
  priceEuro: 500,
  stock: 10,
};
let lineItem: LineItem = {
  product: product,
  quantity: 4,
};
let order: Order = {
  customer: customer,
  lineItems: [lineItem],
  status: "pending",
};
console.log(orderTotal(order));
console.log(formatOrder(order));

console.log(isInStock(product));
