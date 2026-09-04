import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string, newStatus: string }) => {
      const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("تم تحديث حالة الطلب");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("تم حذف الطلب بنجاح");
    }
  });

  const updateOrderStatus = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  const deleteOrder = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مكتمل":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200";
      case "قيد المعالجة":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
      case "بانتظار الدفع":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
      case "ملغى":
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200";
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-muted/20">
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="w-full space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">الطلبات</h2>
              <p className="text-muted-foreground mt-1">متابعة طلبات العملاء وحالتها وتحديثها.</p>
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold w-[120px]">رقم الطلب</TableHead>
                  <TableHead className="font-bold">العميل</TableHead>
                  <TableHead className="font-bold">التوصيل (الولاية والبلدية)</TableHead>
                  <TableHead className="font-bold">التاريخ</TableHead>
                  <TableHead className="font-bold">الإجمالي</TableHead>
                  <TableHead className="font-bold w-[180px]">تحديث الحالة</TableHead>
                  <TableHead className="font-bold w-[120px]">الحالة الحالية</TableHead>
                  <TableHead className="font-bold text-end">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : orders.map((order: any) => (
                  <TableRow key={order.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-muted-foreground px-4">#{order.id.substring(0, 8)}</TableCell>
                    <TableCell className="font-bold px-4">{order.customer_name}</TableCell>
                    <TableCell className="px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{order.wilaya}</span>
                        <span className="text-xs text-muted-foreground">{order.baladiya}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm px-4">
                      {new Date(order.created_at).toLocaleDateString("ar-DZ")}
                    </TableCell>
                    <TableCell className="font-bold text-primary px-4">{order.total_amount} د.ج</TableCell>
                    <TableCell className="px-4">
                      <Select 
                        defaultValue={order.status} 
                        onValueChange={(val) => updateOrderStatus(order.id, val)}
                      >
                        <SelectTrigger className="h-8 w-full bg-background">
                          <SelectValue placeholder="تغيير الحالة" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="مكتمل" className="font-medium">مكتمل</SelectItem>
                          <SelectItem value="قيد المعالجة" className="font-medium">قيد المعالجة</SelectItem>
                          <SelectItem value="بانتظار الدفع" className="font-medium">بانتظار الدفع</SelectItem>
                          <SelectItem value="ملغى" className="font-medium text-destructive">إلغاء الطلب</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge variant="outline" className={getStatusBadge(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-end px-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteOrder(order.id)}
                        title="حذف الطلب"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {orders.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                لا توجد طلبات حالياً.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
