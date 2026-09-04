import { useEffect } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/admin/Sidebar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatPrice } from "@/data/store";
import { useQueryClient } from "@tanstack/react-query";

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

  useEffect(() => {
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
  }, [queryClient]);

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
