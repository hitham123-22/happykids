import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BundleCard } from "@/components/site/BundleCard";
import { useProducts } from "@/lib/products";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/bundles")({
  head: () => ({
    meta: [
      { title: "باقات مميزة | Happy Kids" },
      {
        name: "description",
        content:
          "باقات Happy Kids المميزة: تشكيلات جاهزة من ملابس وأغراض الأطفال بأسعار مخفضة والدفع عند الاستلام.",
      },
      { property: "og:title", content: "باقات مميزة | Happy Kids" },
      {
        property: "og:description",
        content: "اختاروا الباقة المناسبة لطفلكم ووفّروا أكثر.",
      },
      { property: "og:url", content: "/bundles" },
    ],
    links: [{ rel: "canonical", href: "/bundles" }],
  }),
  component: BundlesPage,
});

function BundlesPage() {
  const { products, isLoading } = useProducts();
  const bundles = products.filter((p) => p.is_bundle);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Button variant="ghost" size="sm" asChild className="mb-4 rounded-xl ps-2 text-muted-foreground">
        <Link to="/">
          <ArrowLeft className="me-1 size-4" />
          العودة للرئيسية
        </Link>
      </Button>

      <header className="mb-8">
        <div className="flex items-center gap-2">
          <Gift className="size-6 text-primary" />
          <h1 className="text-2xl font-extrabold sm:text-3xl">باقات مميزة</h1>
        </div>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          تشكيلات جاهزة من ملابس وأغراض الأطفال بأسعار مميزة. اختاروا الباقة اللي تلبي احتياجات طفلكم
          ووفّروا أكثر.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : bundles.length === 0 ? (
        <div className="soft-card px-6 py-16 text-center">
          <h2 className="text-lg font-bold">لا توجد باقات متاحة حاليًا</h2>
          <p className="mt-2 text-sm text-muted-foreground">تابعونا قريبًا، باقات جديدة قيد الإعداد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      )}
    </div>
  );
}
