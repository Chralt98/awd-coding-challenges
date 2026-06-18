import { Button } from "@/components/ui/button";
import { getAllDeliveries } from "@/lib/services/deliveriesService";
import Link from "next/link";
import DeliveryFilter from "./DeliveryFilter";

export default async function DeliveriesPage() {
  const deliveries = await getAllDeliveries(); // calls separate Backend API or makes a direct database query

  return (
    <div>
      <h1 className="text-3xl text-red-500">All Deliveries</h1>
      <Button
        variant="brand"
        nativeButton={false}
        render={<Link href="/deliveries/new" />}
      >
        New Delivery
      </Button>
      <DeliveryFilter deliveries={deliveries} />
    </div>
  );
}
