import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">الإعدادات</h2>
        <p className="text-muted-foreground">إدارة إعدادات المتجر الأساسية.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل المتجر</CardTitle>
          <CardDescription>
            قم بتحديث اسم المتجر ووصفه.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">اسم المتجر</Label>
            <Input id="store-name" defaultValue="Happy Kids" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="store-description">وصف المتجر</Label>
            <Input id="store-description" defaultValue="أفضل ملابس الأطفال" />
          </div>
          <Button>حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
}
