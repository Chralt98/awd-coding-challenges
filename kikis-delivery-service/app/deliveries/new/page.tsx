import { addDelivery } from "@/app/actions";

export default function NewDeliveryPage() {
  return (
    <form action={addDelivery}>
      <input name="pickup" placeholder="Pickup" />
      <input name="destination" placeholder="Destination" />
      <button type="submit">Create request</button>
    </form>
  );
}
