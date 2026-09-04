import { createFileRoute } from "@tanstack/react-router";
import { ProductBrowser } from "@/components/site/ProductBrowser";

type ProductsSearch = { q?: string | undefined };

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "جميع المنتجات | Happy Kids" },
      {
        name: "description",
        content:
          "تشكيلة Happy Kids الكاملة من ملابس الرضع والأطفال والأكسسوارات والأفرشة، بأسعار بالدينار الجزائري.",
      },
      { property: "og:title", content: "جميع المنتجات | Happy Kids" },
      {
        property: "og:description",
        content: "ابحثوا وفلتروا بين منتجات Happy Kids حسب الفئة والسعر.",
      },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

import { useProducts } from "@/lib/products";
import { useCategories } from "@/lib/categories";

function ProductsPage() {
  const { q } = Route.useSearch();
  const { products, isLoading: isProductsLoading } = useProducts();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  
  if (isProductsLoading || isCategoriesLoading) {
    return <div className="p-20 text-center text-muted-foreground">جاري التحميل...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">جميع المنتجات</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          تشكيلة مختارة من ملابس الرضع والأطفال، الأكسسوارات والأفرشة. استعملوا البحث والفلاتر
          للوصول بسرعة إلى ما تحتاجونه.
        </p>
      </header>
      <ProductBrowser source={products} categoriesSource={categories} initialQuery={q ?? ""} />
    </div>
  );
}
