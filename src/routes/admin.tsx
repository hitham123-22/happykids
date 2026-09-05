import { useEffect, useState } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatPrice } from "@/data/store";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    // Nice double chime sound
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.15); // E5
    
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.4);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.4);
  } catch (e) {
    console.error("Audio error", e);
  }
}

function AdminLayout() {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('adminAuth') === 'true' : false;
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "said" && password === "said1234") {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      toast.success("تم تسجيل الدخول بنجاح");
    } else {
      toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Setup Supabase Realtime subscription for new orders
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const newOrder = payload.new;
          playNotificationSound();
          
          toast.success(
            <div className="flex flex-col gap-1">
              <span className="font-bold text-base">🎉 طلبية جديدة!</span>
              <span className="text-sm">من: {newOrder.customer_name} ({newOrder.wilaya})</span>
              <span className="text-sm text-primary font-bold">{formatPrice(newOrder.total_amount)}</span>
            </div>,
            { duration: 10000, position: "top-center" }
          );

          // Invalidate orders query so the tables update automatically
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand p-4" dir="rtl">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/40 w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">تسجيل الدخول</h1>
            <p className="text-muted-foreground text-sm">لوحة تحكم الإدارة</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                required
                dir="ltr"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                required
                dir="ltr"
              />
            </div>
            
            <Button type="submit" className="w-full h-11 text-base mt-2">
              دخول
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-sand">
      <Sidebar />
      
      {/* Main content area */}
      <main className="flex-1 sm:ps-64">
        {/* Mobile header placeholder (if needed later) */}
        <div className="flex h-16 items-center border-b border-border bg-background px-4 sm:hidden">
          <span className="text-lg font-bold">لوحة التحكم</span>
        </div>
        
        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
