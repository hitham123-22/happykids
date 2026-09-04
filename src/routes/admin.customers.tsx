import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">العملاء</h2>
        <p className="text-muted-foreground">عرض وإدارة قائمة العملاء المسجلين.</p>
      </div>

      <div className="rounded-md border bg-card p-8 text-center text-muted-foreground">
        لا يوجد عملاء حتى الآن.
      </div>
    </div>
  );
}
