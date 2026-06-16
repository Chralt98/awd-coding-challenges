import { getAllDeliveries } from "@/lib/services/deliveriesService";
import DeliveryFilter from "./DeliveryFilter";

export default async function DeliveriesPage() {
  const deliveries = await getAllDeliveries(); // calls separate Backend API or makes a direct database query

  return (
    <div>
      <h1>All Deliveries</h1>
      <DeliveryFilter deliveries={deliveries} />
    </div>
  );
}
