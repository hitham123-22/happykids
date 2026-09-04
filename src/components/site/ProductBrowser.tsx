import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/data/store";
import { type Product } from "@/lib/products";
import { type Category } from "@/lib/categories";
import { cn } from "@/lib/utils";

type Sort = "newest" | "price-asc" | "price-desc" | "best" | "sale";

const sortLabels: Record<Sort, string> = {
  newest: "الأحدث",
  "price-asc": "السعر: من الأقل",
  "price-desc": "السعر: من الأعلى",
  best: "الأكثر مبيعًا",
  sale: "التخفيضات",
};

const MAX_PRICE = 7000;
const PAGE_SIZE = 8;

export function ProductBrowser({
  source = [],
  categoriesSource = [],
  initialQuery = "",
  lockedCategory,
  showCategoryFilter = true,
}: {
  source?: Product[];
  categoriesSource?: Category[];
  initialQuery?: string;
  lockedCategory?: string;
  showCategoryFilter?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string>(lockedCategory ?? "all");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<Sort>("newest");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = source.filter((p) => {
      const matchesQuery = !query.trim() || p.name.includes(query.trim());
      const matchesCategory = category === "all" || p.category === category;
      const matchesPrice = p.price <= maxPrice;
      return matchesQuery && matchesCategory && matchesPrice;
    });

    if (sort === "sale") list = list.filter((p) => p.oldPrice);
    if (sort === "best") list = [...list].sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest")
      list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return list;
  }, [source, query, category, maxPrice, sort]);

  const shown = filtered.slice(0, visible);

  return (
    <div>
      <div className="soft-card mb-6 p-3 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="relative min-w-0">
            <Search className="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="ابحث عن منتج..."
              className="h-11 rounded-xl ps-9"
            />
          </div>

          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v as Sort);
              setVisible(PAGE_SIZE);
            }}
          >
            <SelectTrigger className="h-11 min-w-40 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sortLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal className="size-4" />
            الفلاتر
          </Button>
        </div>

        <div className={cn("grid gap-5 pt-4 sm:grid-cols-2", filtersOpen ? "grid" : "hidden")}>
          {showCategoryFilter && (
            <div>
              <p className="mb-2 text-xs font-bold text-muted-foreground">الفئة</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setCategory("all");
                    setVisible(PAGE_SIZE);
                  }}
                  className={cn(
                    "rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors",
                    category === "all" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  الكل
                </button>
                {categoriesSource.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setCategory(cat.slug);
                      setVisible(PAGE_SIZE);
                    }}
                    className={cn(
                      "rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors",
                      category === cat.slug
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted",
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-3 text-xs font-bold text-muted-foreground">
              أقصى سعر: {formatPrice(maxPrice)}
            </p>
            <Slider
              value={[maxPrice]}
              min={500}
              max={MAX_PRICE}
              step={100}
              onValueChange={([v]) => {
                setMaxPrice(v ?? MAX_PRICE);
                setVisible(PAGE_SIZE);
              }}
            />
          </div>
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">عرض {filtered.length} منتجًا</p>

      {filtered.length === 0 ? (
        <div className="soft-card px-6 py-16 text-center">
          <h3 className="text-lg font-bold">لا توجد منتجات مطابقة</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            جرّبوا تعديل البحث أو الفلاتر لعرض منتجات أخرى.
          </p>
          <Button
            variant="outline"
            className="mt-5 rounded-xl"
            onClick={() => {
              setQuery("");
              setCategory(lockedCategory ?? "all");
              setMaxPrice(MAX_PRICE);
              setSort("newest");
            }}
          >
            إعادة تعيين الفلاتر
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {shown.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {visible < filtered.length && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className="rounded-xl px-8"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                عرض المزيد
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
