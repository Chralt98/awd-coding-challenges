import { addDelivery } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewDeliveryPage() {
  return (
    <form action={addDelivery}>
      <Label htmlFor="pickup">Pickup</Label>
      <Input id="pickup" name="pickup" placeholder="Bakery" />
      <Label htmlFor="destination">Destination</Label>
      <Input id="destination" name="destination" placeholder="Airport" />
      <Button type="submit">Create request</Button>
    </form>
  );
}
