import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search["order"] === "string" ? search["order"] : "HK-000000",
  }),
  head: () => ({
    meta: [
      { title: "تم استلام طلبكم | Happy Kids" },
      { name: "description", content: "تم استلام طلبكم بنجاح وسنتواصل معكم لتأكيد التوصيل." },
      { property: "og:title", content: "تم استلام طلبكم | Happy Kids" },
      { property: "og:description", content: "شكراً لثقتكم في Happy Kids." },
      { property: "og:url", content: "/order-success" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/order-success" }],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const { order } = Route.useSearch();

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <span className="mx-auto mb-6 grid size-16 place-items-center rounded-full bg-primary-soft text-primary">
        <CheckCircle2 className="size-8" />
      </span>
      <h1 className="text-2xl font-extrabold">تم استلام طلبك بنجاح ❤️</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        سيتواصل معكم فريقنا هاتفيًا لتأكيد الطلب وترتيب التوصيل. الدفع يتم عند الاستلام.
      </p>
      <p className="mt-6 rounded-xl border border-border bg-sand px-4 py-3 text-sm font-bold">
        رقم الطلب: <span dir="ltr">{order}</span>
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild className="rounded-xl px-8">
          <Link to="/products">مواصلة التسوق</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl px-8">
          <Link to="/">الصفحة الرئيسية</Link>
        </Button>
      </div>
    </div>
  );
}
