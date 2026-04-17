import type { Product, Customer } from "../online-shop-types.js";

export type LineItem = {
  product: Product;
  quantity: number;
};

export type Status = "pending" | "confirmed" | "shipped";

export type Order = {
  customer: Customer;
  lineItems: LineItem[];
  status: Status;
};
