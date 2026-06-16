import { getAllDeliveries } from "@/lib/services/deliveriesService";

export default async function Pages() {
  const allDeliveries = await getAllDeliveries();
  const firstDelivery = allDeliveries[0];

  return (
    <div>
      <h3>{firstDelivery.pickup}</h3>
      <h3>{firstDelivery.destination}</h3>
    </div>
  );
}
