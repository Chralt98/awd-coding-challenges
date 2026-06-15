import { getAllDeliveries } from "@/lib/services/deliveriesService";

export default async function DeliveriesPage() {
  const deliveries = await getAllDeliveries(); // calls separate Backend API or makes a direct database query

  return (
    <div>
      <h1>All Deliveries</h1>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            {delivery.pickup} to {delivery.destination} ({delivery.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
