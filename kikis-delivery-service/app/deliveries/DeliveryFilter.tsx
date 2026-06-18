"use client";

import { useState } from "react";
import type { DeliveryRequest } from "@/lib/services/deliveriesService";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DeliveryFilter({
  deliveries,
}: {
  deliveries: DeliveryRequest[];
}) {
  const [status, setStatus] = useState("all");

  const visible =
    status === "all"
      ? deliveries
      : deliveries.filter((delivery) => delivery.status === status);

  return (
    <div>
      <Select
        value={status}
        onValueChange={(value) => setStatus(value ?? "all")}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="accepted">Accepted</SelectItem>
          <SelectItem value="fulfilled">Fulfilled</SelectItem>
        </SelectContent>
      </Select>
      <ul>
        {visible.map((delivery) => (
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
