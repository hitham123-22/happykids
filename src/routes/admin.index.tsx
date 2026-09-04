import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, Wallet, Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ["admin_orders_overview"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["admin_products_overview"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      return data || [];
    }
  });

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const totalOrders = orders.length;
    const inventoryValue = products.reduce((sum, product) => sum + (product.price * (product.stock || 0)), 0);
    const activeProducts = products.length;
    return { totalRevenue, totalOrders, inventoryValue, activeProducts };
  }, [orders, products]);

  const chartData = useMemo(() => {
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const grouped = orders.reduce((acc: any, order) => {
      const d = new Date(order.created_at);
      const m = d.getMonth();
      acc[m] = (acc[m] || 0) + (order.total_amount || 0);
      return acc;
    }, {});
    
    // Just show last 6 months up to current month for simplicity, or 6 fixed months if empty
    const currentMonth = new Date().getMonth();
    const data = [];
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12;
      data.push({
        name: months[m],
        total: grouped[m] || 0
      });
    }
    return data;
  }, [orders]);

  if (isLoadingOrders || isLoadingProducts) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">نظرة عامة</h2>
        <p className="text-muted-foreground mt-2">مرحباً بك في لوحة تحكم المتجر. إليك ملخص الأداء.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-t-4 border-t-primary bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} د.ج</div>
            <p className="text-xs text-emerald-500 font-medium mt-1">
              مجموع كل الطلبات
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-t-4 border-t-secondary bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
            <div className="p-2 bg-secondary/10 rounded-full text-secondary">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-emerald-500 font-medium mt-1">
              إجمالي الطلبات المسجلة
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-t-4 border-t-accent-foreground bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">قيمة المخزون</CardTitle>
            <div className="p-2 bg-accent rounded-full text-accent-foreground">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.inventoryValue.toLocaleString()} د.ج</div>
            <p className="text-xs text-emerald-500 font-medium mt-1">
              إجمالي قيمة المنتجات المتوفرة
            </p>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-t-4 border-t-primary-soft bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المنتجات النشطة</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full text-primary-soft">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              منتج مسجل في المتجر
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>نظرة عامة على المبيعات</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>الطلبات الأخيرة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center p-3 rounded-lg transition-colors hover:bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold ml-4">
                    {order.customer_name?.charAt(0) || "-"}
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-semibold leading-none truncate max-w-[150px]">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.wilaya}</p>
                  </div>
                  <div className="font-bold text-primary whitespace-nowrap">
                    +{order.total_amount?.toLocaleString() || 0} د.ج
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center text-muted-foreground py-4 text-sm">لا توجد طلبات بعد</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
