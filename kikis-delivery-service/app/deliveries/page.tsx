import { getAllDeliveries } from "@/lib/services/deliveriesService";
import Link from "next/link";

export default async function DeliveriesPage() {
  const deliveries = await getAllDeliveries(); // calls separate Backend API or makes a direct database query

  return (
    <div>
      <h1>All Deliveries</h1>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            <Link href={`/deliveries/${delivery.id}`}>
              {delivery.pickup} to {delivery.destination} ({delivery.status})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
