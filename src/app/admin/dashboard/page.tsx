
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex space-x-4">
        <Button variant="outline">Members</Button>
        <Button variant="outline">Events</Button>
        <Button variant="outline">Partners</Button>
        <Button variant="outline">Stats</Button>
        <Button variant="outline">Testimonials</Button>
      </div>
    </div>
  );
}
