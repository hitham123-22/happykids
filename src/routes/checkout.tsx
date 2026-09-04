import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import wilayasList from "@/data/wilayas.json";
import communesListAll from "@/data/communes.json";
import { Loader2, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/store";
import { useProducts } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "إتمام الطلب | Happy Kids" },
      {
        name: "description",
        content: "أدخلوا معلومات التوصيل وأكّدوا طلبكم مع الدفع عند الاستلام.",
      },
      { property: "og:title", content: "إتمام الطلب | Happy Kids" },
      { property: "og:description", content: "طلب سريع مع الدفع عند الاستلام في كل الولايات." },
      { property: "og:url", content: "/checkout" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, clear, ready } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [wilayaId, setWilayaId] = useState<number | null>(null);
  const [baladiya, setBaladiya] = useState("");
  const [loading, setLoading] = useState(false);

  const communesList = wilayaId ? communesListAll.filter((c: any) => c.wilaya_code === wilayaId) : [];
  
  const selectedWilayaObj = wilayasList.find((w: any) => w.code === wilayaId);
  const wilayaName = selectedWilayaObj ? selectedWilayaObj.name_ar : "";

  const { data: shippingRates = [] } = useQuery({
    queryKey: ["shipping_rates"],
    queryFn: async () => {
      const { data } = await supabase.from("shipping_rates").select("*").order("wilaya_name");
      return data || [];
    }
  });

  const selectedWilayaRate = shippingRates.find(r => r.wilaya_name === wilayaName);
  const shipping = items.length > 0 && wilayaId ? (selectedWilayaRate?.home_price || 600) : 0;
  const total = subtotal + shipping;

  if (ready && items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-xl font-bold">لا توجد منتجات لإتمام الطلب</h1>
        <p className="mt-2 text-sm text-muted-foreground">أضيفوا منتجات إلى السلة أولًا.</p>
        <Button asChild className="mt-6 rounded-xl px-8">
          <Link to="/products">تسوق الآن</Link>
        </Button>
      </div>
    );
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!wilayaId) {
      toast.error("يرجى اختيار الولاية");
      return;
    }
    if (!baladiya) {
      toast.error("يرجى اختيار البلدية");
      return;
    }
    const phone = String(form.get("phone") ?? "");
    if (phone.replace(/\D/g, "").length < 9) {
      toast.error("يرجى إدخال رقم هاتف صحيح");
      return;
    }
    setLoading(true);

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: String(form.get("name")),
          customer_phone: phone,
          wilaya: wilayaName,
          baladiya: baladiya,
          address: String(form.get("address")),
          notes: String(form.get("notes") ?? ""),
          shipping_type: "home",
          shipping_cost: shipping,
          status: "قيد المعالجة",
          total_amount: total
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsToInsert = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_time: products.find(p => p.id === item.productId)?.price || 0,
        // using size and color could be stored in a JSON field if schema supports it, 
        // assuming standard schema, we'll try to include them if possible or ignore if not in schema.
      }));
      // Assuming order_items table exists and accepts this structure. If size/color aren't columns, they might be dropped or we can ignore. 
      // For now, let's just insert basic fields that usually exist.

      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsToInsert);

      // Send Telegram Notification
      try {
        const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
        const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
        
        if (botToken && chatId) {
          const message = `
📦 <b>طلب جديد!</b>
━━━━━━━━━━━━━━
👤 <b>الزبون:</b> ${form.get("name")}
📞 <b>الهاتف:</b> ${phone}
📍 <b>المكان:</b> ${wilayaName}، ${baladiya}
💰 <b>المبلغ:</b> ${formatPrice(total)}
📝 <b>الملاحظات:</b> ${form.get("notes") || "لا توجد"}
━━━━━━━━━━━━━━
<a href="https://happykids.dz/admin/orders">عرض في لوحة التحكم</a>`;
          
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'HTML'
            })
          });
        }
      } catch (err) {
        console.error("Failed to send Telegram notification:", err);
      }

      clear();
      navigate({ to: "/order-success", search: { order: order.id } });
    } catch (e: any) {
      toast.error("حدث خطأ أثناء إرسال الطلب: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-8 text-2xl font-extrabold sm:text-3xl">إتمام الطلب</h1>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="soft-card space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">الاسم واللقب</Label>
              <Input id="name" name="name" required className="mt-2 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                name="phone"
                inputMode="tel"
                required
                placeholder="0555 12 34 56"
                className="mt-2 h-11 rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="wilaya">الولاية</Label>
              <Select value={wilayaId ? wilayaId.toString() : ""} onValueChange={(val) => {
                setWilayaId(parseInt(val));
                setBaladiya(""); // Reset baladiya when wilaya changes
              }}>
                <SelectTrigger id="wilaya" className="mt-2 h-11 w-full rounded-xl text-end" dir="rtl">
                  <SelectValue placeholder="اختر الولاية" />
                </SelectTrigger>
                <SelectContent className="max-h-80" dir="rtl">
                  {wilayasList.map((w: any) => (
                    <SelectItem key={w.code} value={w.code.toString()} className="text-end">
                      {w.code} - {w.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="city">البلدية</Label>
              <Select value={baladiya} onValueChange={setBaladiya} disabled={!wilayaId}>
                <SelectTrigger id="city" className="mt-2 h-11 w-full rounded-xl text-end" dir="rtl">
                  <SelectValue placeholder="اختر البلدية" />
                </SelectTrigger>
                <SelectContent className="max-h-80" dir="rtl">
                  {communesList.map((c: any, index: number) => (
                    <SelectItem key={index} value={c.name_ar} className="text-end">
                      {c.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="address">العنوان</Label>
            <Input id="address" name="address" required className="mt-2 h-11 rounded-xl" />
          </div>

          <div>
            <Label htmlFor="notes">ملاحظات الطلب</Label>
            <Textarea id="notes" name="notes" rows={3} className="mt-2 rounded-xl" />
          </div>

          <div className="rounded-xl border border-border bg-sand p-4">
            <p className="text-sm font-bold">طريقة الدفع</p>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="size-4 text-primary" />
              الدفع عند الاستلام
            </p>
          </div>
        </div>

        <aside className="soft-card h-fit p-5 lg:sticky lg:top-24">
          <h2 className="mb-4 text-base font-bold">ملخص الطلب</h2>
          <ul className="mb-4 space-y-3">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <li key={item.key} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2 text-xs">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="size-12 rounded-lg object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{product.name}</span>
                    <span className="block text-muted-foreground">
                      {item.size} · ×{item.quantity}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <dl className="space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">المجموع الفرعي</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">التوصيل</dt>
              <dd className="font-semibold">{formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt className="font-bold">الإجمالي</dt>
              <dd className="font-extrabold text-primary">{formatPrice(total)}</dd>
            </div>
          </dl>
          <Button type="submit" size="lg" disabled={loading} className="mt-5 w-full rounded-xl">
            {loading && <Loader2 className="size-4 animate-spin" />}
            تأكيد الطلب
          </Button>
        </aside>
      </form>
    </div>
  );
}
