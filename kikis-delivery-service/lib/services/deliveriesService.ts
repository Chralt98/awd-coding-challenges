import sql from "../db";

export type DeliveryStatus = "active" | "accepted" | "denied" | "fulfilled";

export type DeliveryRequest = {
  id: string;
  pickup: string;
  destination: string;
  status: DeliveryStatus;
};

export async function getAllDeliveries(): Promise<DeliveryRequest[]> {
  return sql<DeliveryRequest[]>`SELECT * FROM deliveries`;
}

export async function getDeliveryById(
  id: string,
): Promise<DeliveryRequest | null> {
  const [delivery] = await sql<DeliveryRequest[]>`
    SELECT * FROM deliveries WHERE id = ${id}
  `;
  return delivery ?? null;
}

export async function createDelivery(
  delivery: Pick<DeliveryRequest, "pickup" | "destination">,
): Promise<DeliveryRequest> {
  const [created] = await sql<
    DeliveryRequest[]
  >`INSERT INTO deliveries (pickup, destination, status)
    VALUES (${delivery.pickup}, ${delivery.destination}, 'active')
    RETURNING *
  `;
  return created;
}
