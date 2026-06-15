import { getAllDeliveries } from "@/lib/services/deliveriesService";

export default function Pages() {
  const allDeliveries = getAllDeliveries();
  const firstDelivery = allDeliveries[0];

  return (
    <div>
      <h3>{firstDelivery.pickup}</h3>
      <h3>{firstDelivery.destination}</h3>
    </div>
  );
}
