import { getAllDeliveries } from "@/lib/services/deliveriesService";

export default async function DeliveriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deliveries = await getAllDeliveries();
  const delivery = deliveries.find((d) => d.id === id);
  if (!delivery) {
    return <div>Delivery not found</div>;
  }
  return (
    <div>
      <h1>
        Delivery with key {delivery.id} for pickup {delivery.pickup} to{" "}
        {delivery.destination} ({delivery.status})
      </h1>
    </div>
  );
}
