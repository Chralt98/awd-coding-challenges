"use client";

import { useState } from "react";
import type { DeliveryRequest } from "@/lib/services/deliveriesService";

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
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="all">All</option>
        <option value="active">Active</option>
        <option value="accepted">Accepted</option>
        <option value="fulfilled">Fulfilled</option>
      </select>
      <ul>
        {visible.map((delivery) => (
          <li key={delivery.id}>
            {delivery.pickup} to {delivery.destination} ({delivery.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
