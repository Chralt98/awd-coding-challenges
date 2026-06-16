"use server";

import { createDelivery } from "@/lib/services/deliveriesService";
import { revalidatePath } from "next/cache";

export async function addDelivery(formData: FormData) {
  const pickup = formData.get("pickup") as string;
  const destination = formData.get("destination") as string;

  await createDelivery(pickup, destination);
  revalidatePath("/deliveries");
}
