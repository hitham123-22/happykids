import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/store";
import { useProducts } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سلة المشتريات | Happy Kids" },
      { name: "description", content: "راجعوا منتجات سلتكم قبل إتمام الطلب في متجر Happy Kids." },
      { property: "og:title", content: "سلة المشتريات | Happy Kids" },
      { property: "og:description", content: "راجعوا سلتكم وأتمّوا الطلب بسهولة." },
      { property: "og:url", content: "/cart" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/cart" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, setQuantity, subtotal, shipping, total, ready } = useCart();
  const { products } = useProducts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-8 text-2xl font-extrabold sm:text-3xl">سلة المشتريات</h1>

      {!ready ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="soft-card h-28 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="soft-card px-6 py-16 text-center">
          <span className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
            <ShoppingBag className="size-6" />
          </span>
          <h2 className="text-lg font-bold">سلتكم فارغة</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            تصفّحوا المنتجات وأضيفوا ما يناسب طفلكم.
          </p>
          <Button asChild className="mt-6 rounded-xl px-8">
            <Link to="/products">تسوق الآن</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <ul className="space-y-3">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <li key={item.key} className="soft-card grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 p-3">
                  <Link to="/products/$slug" params={{ slug: product.slug }}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      width={900}
                      height={900}
                      className="size-22 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="min-w-0">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                      <Link
                        to="/products/$slug"
                        params={{ slug: product.slug }}
                        className="truncate text-sm font-bold"
                      >
                        {product.name}
                      </Link>
                      <button
                        onClick={() => remove(item.key)}
                        aria-label="حذف المنتج"
                        className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      المقاس: {item.size} · اللون: {item.color}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-1 rounded-xl border border-border p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="إنقاص"
                          onClick={() => setQuantity(item.key, item.quantity - 1)}
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="زيادة"
                          onClick={() => setQuantity(item.key, item.quantity + 1)}
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </div>
                      <span className="text-sm font-extrabold text-primary">
                        {formatPrice(product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="soft-card h-fit p-5 lg:sticky lg:top-24">
            <h2 className="mb-4 text-base font-bold">ملخص الطلب</h2>
            <dl className="space-y-3 text-sm">
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
            <Button asChild size="lg" className="mt-5 w-full rounded-xl">
              <Link to="/checkout">إتمام الطلب</Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full rounded-xl">
              <Link to="/products">مواصلة التسوق</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}
