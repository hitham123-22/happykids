import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/data/store";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "الأصناف | Happy Kids" },
      {
        name: "description",
        content:
          "تصفحوا أصناف Happy Kids: ملابس الرضع، ملابس الأطفال، الأكسسوارات، والأفرشة والأغطية.",
      },
      { property: "og:title", content: "الأصناف | Happy Kids" },
      { property: "og:description", content: "أصناف ملابس ومستلزمات الأطفال في متجر Happy Kids." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">الأصناف</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          اختاروا الصنف المناسب لتصفّح المنتجات المتوفرة داخله.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.slug).length;
          return (
            <Link
              key={cat.slug}
              to="/category/$slug"
              params={{ slug: cat.slug }}
              className="group soft-card grid grid-cols-[9rem_minmax(0,1fr)] overflow-hidden transition-shadow hover:shadow-card sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <img
                src={cat.image}
                alt={`فئة ${cat.name}`}
                loading="lazy"
                width={1000}
                height={1000}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-4">
                <h2 className="text-base font-bold sm:text-lg">{cat.name}</h2>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">{count} منتجًا</p>
                <span className="mt-2 inline-block text-sm font-bold text-primary">
                  اكتشف المجموعة
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
