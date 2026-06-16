import { getDeliveryById } from "@/lib/services/deliveriesService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const delivery = await getDeliveryById(id);

  if (!delivery) {
    return new Response(`Delivery with id ${id} not found`, { status: 404 });
  }

  return Response.json(delivery);
}
