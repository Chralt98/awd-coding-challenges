import {
  getAllDeliveries,
  getDeliveryById,
} from "@/lib/services/deliveriesService";
import Link from "next/link";

export async function generateStaticParams() {
  const deliveries = await getAllDeliveries();
  return deliveries.map((delivery) => ({ id: delivery.id }));
}

export default async function DeliveryDetailPage({
  params,
}: PageProps<"/deliveries/[id]">) {
  const { id } = await params;
  const delivery = await getDeliveryById(id);

  if (!delivery) {
    throw new Error(`Delivery with id ${id} not found`);
  }

  return (
    <div>
      <h1>Delivery {id}</h1>
      <p>
        From {delivery.pickup} to {delivery.destination}
      </p>
      <p>Status: {delivery.status}</p>
      <Link href="/deliveries">Back to all deliveries</Link>
    </div>
  );
}
