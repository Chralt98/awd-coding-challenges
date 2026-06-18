import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAllDeliveries,
  getDeliveryById,
} from "@/lib/services/deliveriesService";
import Link from "next/link";

const statusColors: Record<string, string> = {
  active: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  denied: "bg-red-100 text-red-800",
  fulfilled: "bg-purple-100 text-purple-800",
};

export async function generateStaticParams() {
  const deliveries = await getAllDeliveries();
  return deliveries.map((delivery) => ({ id: String(delivery.id) }));
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
    <div className="mx-auto max-w-lg py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Delivery #{id}</CardTitle>
          <CardDescription>
            <span
              className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${statusColors[delivery.status] ?? "bg-muted text-muted-foreground"}`}
            >
              {delivery.status}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Pickup
              </p>
              <p className="font-medium">{delivery.pickup}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Destination
              </p>
              <p className="font-medium">{delivery.destination}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link
            href="/deliveries"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            &larr; Back to all deliveries
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
