import { Link } from "@tanstack/react-router";
import { Gift, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { discountPercent, formatPrice } from "@/data/store";
import { type Product } from "@/lib/products";

export function BundleCard({ bundle }: { bundle: Product }) {
  const { add } = useCart();
  const { products } = useProducts();
  const discount = discountPercent(bundle);
  const savings = bundle.oldPrice ? bundle.oldPrice - bundle.price : 0;

  // Get names of the bundle items
  const bundleItemNames = (bundle.bundleItems || []).map(id => {
    const product = products.find(p => p.id === id);
    return product ? product.name : "منتج";
  });

  return (
    <article className="group soft-card relative flex flex-col overflow-hidden border-2 border-primary/10 transition-shadow duration-300 hover:shadow-card">
      <div className="absolute top-3 start-3 z-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
          <Gift className="size-3" />
          باقة
        </span>
      </div>

      <Link
        to="/products/$slug"
        params={{ slug: bundle.slug }}
        className="relative block aspect-square overflow-hidden bg-sand"
      >
        <img
          src={bundle.images[0] || "/placeholder-image.jpg"}
          alt={bundle.name}
          loading="lazy"
          width={900}
          height={900}
          className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {bundle.images[1] && (
          <img
            src={bundle.images[1]}
            alt={`${bundle.name} — صورة إضافية`}
            loading="lazy"
            width={900}
            height={900}
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {discount && (
          <div className="absolute top-3 end-3">
            <span className="rounded-full bg-secondary-soft px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">
              وفّر {discount}%
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <Link to="/products/$slug" params={{ slug: bundle.slug }} className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug sm:text-[15px]">{bundle.name}</h3>
        </Link>

        {bundleItemNames.length > 0 && (
          <ul className="space-y-1 rounded-xl bg-sand/60 p-2 text-[11px] text-muted-foreground sm:text-xs">
            {bundleItemNames.map((name, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                {name}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <span className="text-base font-extrabold text-primary sm:text-lg">{formatPrice(bundle.price)}</span>
          {bundle.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(bundle.oldPrice)}</span>
          )}
          {savings > 0 && (
            <span className="text-[11px] font-medium text-emerald-600">وفّر {formatPrice(savings)}</span>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Button variant="outline" size="sm" asChild className="rounded-xl">
            <Link to="/products/$slug" params={{ slug: bundle.slug }}>
              تفاصيل الباقة
            </Link>
          </Button>
          <Button
            size="sm"
            className="rounded-xl"
            disabled={!bundle.inStock}
            aria-label="أضف الباقة إلى السلة"
            onClick={() => {
              add(bundle, bundle.sizes[0] ?? "", bundle.colors[0] ?? "");
              toast.success("تمت إضافة الباقة إلى السلة");
            }}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
