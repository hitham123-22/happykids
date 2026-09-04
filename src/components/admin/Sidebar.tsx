import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  Settings,
  Store,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "نظرة عامة", href: "/admin", icon: LayoutDashboard },
  { name: "المنتجات", href: "/admin/products", icon: Package },
  { name: "الباقات المميزة", href: "/admin/bundles", icon: Tags },
  { name: "الطلبات", href: "/admin/orders", icon: ShoppingCart },
  { name: "التوصيل", href: "/admin/shipping", icon: Truck },
  { name: "الفئات", href: "/admin/categories", icon: Tags },
  { name: "العملاء", href: "/admin/customers", icon: Users },
  { name: "الإعدادات", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed bottom-0 start-0 top-0 z-40 hidden w-64 flex-col border-e border-white/20 bg-background/80 backdrop-blur-xl shadow-2xl sm:flex">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-6">
        <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-soft text-primary-foreground shadow-md">
          <Store className="size-5" />
        </div>
        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">لوحة التحكم</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== "/admin" && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:scale-[1.02]"
              )}
            >
              <item.icon className="size-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-muted/80 hover:text-foreground hover:scale-[1.02]"
        >
          <Store className="size-5" />
          العودة للمتجر
        </Link>
      </div>
    </aside>
  );
}
