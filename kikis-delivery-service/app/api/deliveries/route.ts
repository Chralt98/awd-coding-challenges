import { getAllDeliveries } from "@/lib/services/deliveriesService";

export async function GET() {
  const deliveries = await getAllDeliveries();
  return Response.json(deliveries);
}
