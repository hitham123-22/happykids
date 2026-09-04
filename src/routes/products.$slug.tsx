import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Check, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ProductCard } from "@/components/site/ProductCard";
import { useCart } from "@/lib/cart";
import {
  categoryName,
  discountPercent,
  formatPrice,
} from "@/data/store";
import { type Product, useProducts } from "@/lib/products";
import { useCategories } from "@/lib/categories";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    return { slug: params.slug };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "المنتج غير متوفر | Happy Kids" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.name} | Happy Kids` },
        { name: "description", content: product.description.slice(0, 155) },
        { property: "og:title", content: `${product.name} | Happy Kids` },
        { property: "og:description", content: product.description.slice(0, 155) },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/products/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/products/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "DZD",
              availability: product.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          }),
        },
      ],
    };
  },
  component: ProductPageWrapper,
});

function ProductPageWrapper() {
  const { slug } = Route.useLoaderData();
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  
  if (isLoading) {
    return <div className="p-20 text-center text-muted-foreground">جاري التحميل...</div>;
  }
  
  const product = products.find(p => p.slug === slug);
  if (!product) {
    return <div className="p-20 text-center text-muted-foreground">المنتج غير موجود</div>;
  }

  return <ProductView key={product.id} product={product} allProducts={products} categories={categories} />;
}

function ProductView({ product, allProducts, categories }: { product: Product, allProducts: Product[], categories: any[] }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [color, setColor] = useState(product.colors?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);

  const discount = discountPercent(product);
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
    
  const catName = categories.find(c => c.slug === product.category)?.name || categoryName(product.category);

  const addToCart = () => {
    add(product, size, color, quantity);
    toast.success("تمت إضافة المنتج إلى السلة");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          الرئيسية
        </Link>
        <span className="px-2">/</span>
        <Link to="/category/$slug" params={{ slug: product.category }} className="hover:text-primary">
          {catName}
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <button
            onClick={() => setZoom(true)}
            className="block w-full overflow-hidden rounded-3xl bg-sand"
            aria-label="تكبير الصورة"
          >
            <img
              src={product.images[activeImage]}
              alt={product.name}
              width={900}
              height={900}
              className="aspect-square w-full object-cover"
            />
          </button>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(index)}
                  aria-label={`صورة ${index + 1}`}
                  className={cn(
                    "size-20 overflow-hidden rounded-xl border-2 transition-colors",
                    index === activeImage ? "border-primary" : "border-border",
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} صورة ${index + 1}`}
                    loading="lazy"
                    width={900}
                    height={900}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{product.name}</h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-extrabold text-primary">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            {discount && (
              <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
                تخفيض {discount}%
              </span>
            )}
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold">
            {product.inStock ? (
              <>
                <Check className="size-4 text-primary" /> متوفر
              </>
            ) : (
              <span className="text-muted-foreground">غير متوفر حاليًا</span>
            )}
          </p>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-7">
            <p className="mb-2 text-sm font-bold">المقاس</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((option) => (
                <button
                  key={option}
                  onClick={() => setSize(option)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                    option === size
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-bold">اللون</p>
            <div className="flex flex-wrap gap-2">
              {product.colors?.map((option) => (
                <button
                  key={option}
                  onClick={() => setColor(option)}
                  className={cn(
                    "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                    option === color
                      ? "border-primary bg-primary-soft text-primary"
                      : "border-border hover:bg-muted",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-bold">الكمية</p>
            <div className="inline-flex items-center gap-1 rounded-xl border border-border p-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label="إنقاص الكمية"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </Button>
              <span className="w-10 text-center text-sm font-bold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="زيادة الكمية"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Button size="lg" className="rounded-xl" disabled={!product.inStock} onClick={addToCart}>
              <ShoppingBag className="size-4" />
              أضف إلى السلة
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl"
              disabled={!product.inStock}
              onClick={() => {
                add(product, size, color, quantity);
                navigate({ to: "/checkout" });
              }}
            >
              اطلب الآن
            </Button>
          </div>

          <p className="mt-5 flex items-center gap-2 rounded-xl bg-sand p-3 text-xs text-muted-foreground">
            <Truck className="size-4 shrink-0 text-primary" />
            التوصيل إلى كل الولايات مع إمكانية الدفع عند الاستلام.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-extrabold sm:text-2xl">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      <Dialog open={zoom} onOpenChange={setZoom}>
        <DialogContent className="max-w-3xl rounded-2xl p-2">
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
          <img
            src={product.images[activeImage]}
            alt={product.name}
            width={900}
            height={900}
            className="w-full rounded-xl object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
