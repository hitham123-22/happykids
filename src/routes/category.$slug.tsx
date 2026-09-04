import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProductBrowser } from "@/components/site/ProductBrowser";
import { useCategories } from "@/lib/categories";
import { useProducts } from "@/lib/products";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    return { slug: params.slug };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "الفئة غير متوفرة | Happy Kids" }, { name: "robots", content: "noindex" }] };
    }
    const { category } = loaderData;
    return {
      meta: [
        { title: `${category.name} | Happy Kids` },
        { name: "description", content: category.description },
        { property: "og:title", content: `${category.name} | Happy Kids` },
        { property: "og:description", content: category.description },
        { property: "og:url", content: `/category/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/category/${params.slug}` }],
    };
  },
  component: CategoryPageWrapper,
});

function CategoryPageWrapper() {
  const { slug } = Route.useLoaderData();
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { products, isLoading: isProductsLoading } = useProducts();
  
  if (isCategoriesLoading || isProductsLoading) {
    return <div className="p-20 text-center text-muted-foreground">جاري التحميل...</div>;
  }
  
  const category = categories.find(c => c.slug === slug);
  if (!category) {
    return <div className="p-20 text-center text-muted-foreground">الفئة غير متوفرة</div>;
  }
  
  return <CategoryView category={category} allProducts={products} categoriesSource={categories} />;
}

function CategoryView({ category, allProducts, categoriesSource }: { category: any, allProducts: any[], categoriesSource: any[] }) {
  const list = allProducts.filter((p) => p.category === category.slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">
          الرئيسية
        </Link>
        <span className="px-2">/</span>
        <Link to="/categories" className="hover:text-primary">
          الأصناف
        </Link>
        <span className="px-2">/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      <header className="mb-8 grid items-center gap-5 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold sm:text-3xl">{category.name}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {/* {category.description} */}
          </p>
        </div>
        <img
          src={category.imageUrl || ""}
          alt={`فئة ${category.name}`}
          loading="lazy"
          width={1000}
          height={1000}
          className="hidden h-32 w-full rounded-2xl object-cover sm:block"
        />
      </header>

      <ProductBrowser source={list} categoriesSource={categoriesSource} lockedCategory={category.slug} showCategoryFilter={false} />
    </div>
  );
}
