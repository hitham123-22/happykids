import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { discountPercent, formatPrice } from "@/data/store";
import { type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const discount = discountPercent(product);

  return (
    <article className="group soft-card flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-card">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-sand"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={900}
          height={900}
          className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} — صورة إضافية`}
            loading="lazy"
            width={900}
            height={900}
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute top-3 start-3 flex flex-col items-start gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-secondary-soft px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">
              جديد
            </span>
          )}
          {discount && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
              تخفيض {discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-bold text-background">
              غير متوفر
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
        <Link to="/products/$slug" params={{ slug: product.slug }} className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-bold leading-snug sm:text-[15px]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex flex-wrap items-baseline gap-2">
          <span className="text-base font-extrabold text-primary sm:text-lg">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Button variant="outline" size="sm" asChild className="rounded-xl">
            <Link to="/products/$slug" params={{ slug: product.slug }}>
              عرض المنتج
            </Link>
          </Button>
          <Button
            size="sm"
            className="rounded-xl"
            disabled={!product.inStock}
            aria-label="أضف إلى السلة"
            onClick={() => {
              add(product, product.sizes[0] ?? "", product.colors[0] ?? "");
              toast.success("تمت إضافة المنتج إلى السلة");
            }}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="soft-card overflow-hidden">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-9 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
