export type Product = {
  readonly id: string;
  name: string;
  priceEuro: number;
  stock: number;
};

export type Category = {
  name: string;
  description?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
};
