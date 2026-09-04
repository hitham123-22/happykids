import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Facebook, Heart, Instagram, PackageCheck, Sparkles, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { BundleCard } from "@/components/site/BundleCard";
import { ProductBrowser } from "@/components/site/ProductBrowser";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useCarousel } from "@/hooks/useCarousel";
import { useCategories } from "@/lib/categories";
import { useProducts } from "@/lib/products";
import { categories as storeCategories } from "@/data/store";
import hero from "@/assets/hero.jpg";
import brand from "@/assets/brand.jpg";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.125.298-.326.446-.489.149-.163.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

const socialLinks = [
  { label: "تيك توك", href: "https://www.tiktok.com/@happykids079?_r=1&_t=ZS-99NbaEdt56K", Icon: TikTokIcon, color: "hover:bg-[#010101] hover:text-white" },
  { label: "إنستغرام", href: "https://www.instagram.com/happy_kids774?igsi=NHkzaDhmempjb3F1&utm_source=qr", Icon: Instagram, color: "hover:bg-[#E4405F] hover:text-white" },
  { label: "فيسبوك", href: "https://www.facebook.com/share/1E9whkJCWE/?mibextid=wwXIfr", Icon: Facebook, color: "hover:bg-[#1877F3] hover:text-white" },
  { label: "واتساب", href: "https://wa.me/213771264245", Icon: WhatsAppIcon, color: "hover:bg-[#25D366] hover:text-white" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Kids | ملابس ومستلزمات الرضع والأطفال في الجزائر" },
      {
        name: "description",
        content:
          "أناقة صغيرة بفرحة كبيرة: ملابس رضع وأطفال، أكسسوارات وأفرشة مختارة بعناية، مع الدفع عند الاستلام في كل الولايات.",
      },
      { property: "og:title", content: "Happy Kids | ملابس ومستلزمات الرضع والأطفال" },
      {
        property: "og:description",
        content: "تشكيلة ناعمة ومريحة من ملابس الرضع والأطفال بأسعار بالدينار الجزائري.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function CarouselControls({
  onPrev,
  onNext,
  canPrev,
  canNext,
  labelPrev = "السابق",
  labelNext = "التالي",
}: {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  labelPrev?: string;
  labelNext?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 sm:hidden">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label={labelPrev}
        className="grid size-9 place-items-center rounded-full border border-border bg-background/95 text-foreground shadow-sm backdrop-blur-sm transition-all active:scale-95 disabled:opacity-0"
      >
        <ChevronRight className="size-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        aria-label={labelNext}
        className="grid size-9 place-items-center rounded-full border border-border bg-background/95 text-foreground shadow-sm backdrop-blur-sm transition-all active:scale-95 disabled:opacity-0"
      >
        <ChevronLeft className="size-5" />
      </button>
    </div>
  );
}

function Home() {
  const { products, isLoading: isProductsLoading } = useProducts();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const newArrivals = products.slice(0, 8); // Simplification: get first 8 products
  const bundles = products.filter((p) => p.is_bundle);
  const categoriesCarousel = useCarousel();
  const bundlesCarousel = useCarousel();

  return (
    <>
      <section className="relative overflow-hidden bg-primary-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:py-20">
          <div className="fade-up order-2 text-center lg:order-1 lg:text-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" />
              تشكيلة موسم جديدة
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Happy Kids كل ما يحتاجه طفلك بكل حب واهتمام
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
              اكتشفوا أجمل ملابس وإكسسوارات أطفالكم، مختارة بعناية لتمنحهم الراحة والأناقة في كل
              لحظة.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg" asChild className="rounded-xl px-8">
                <Link to="/products">تسوق الآن</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-xl bg-background px-8">
                <Link to="/categories">اكتشف المجموعة</Link>
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">
              <span className="text-xs font-medium text-muted-foreground">تابعونا:</span>
              <div className="flex items-center gap-2">
                {socialLinks.map(({ label, href, Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`grid size-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-200 hover:scale-110 hover:shadow-sm ${color}`}
                  >
                    <Icon className="size-[18px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <img
              src={hero}
              alt="رضيع وطفلة صغيرة يرتدون ملابس ناعمة من تشكيلة Happy Kids"
              width={1600}
              height={1200}
              className="h-56 w-full rounded-3xl object-cover shadow-card sm:h-80 lg:h-[26rem]"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-border bg-sand py-6">
        {/* Mobile: horizontal marquee */}
        <div className="marquee-track flex w-max items-center gap-10 pl-10 sm:hidden">
          {[0, 1].map((copy) =>
            [
              { icon: Truck, title: "توصيل لكل الولايات", text: "58 ولاية عبر شركات التوصيل" },
              { icon: PackageCheck, title: "الدفع عند الاستلام", text: "افحصوا الطلب قبل الدفع" },
              { icon: Heart, title: "أقمشة لطيفة على البشرة", text: "قطن مختار بعناية للرضع" },
            ].map((item) => (
              <div
                key={`mobile-${copy}-${item.title}`}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center gap-3"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background text-primary">
                  <item.icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{item.title}</span>
                  <span className="block text-xs text-muted-foreground">{item.text}</span>
                </span>
              </div>
            )),
          )}
        </div>

        {/* Desktop & tablet: static centered grid */}
        <div className="mx-auto hidden max-w-6xl grid-cols-3 gap-6 px-4 sm:grid sm:px-6">
          {[
            { icon: Truck, title: "توصيل لكل الولايات", text: "58 ولاية عبر شركات التوصيل" },
            { icon: PackageCheck, title: "الدفع عند الاستلام", text: "افحصوا الطلب قبل الدفع" },
            { icon: Heart, title: "أقمشة لطيفة على البشرة", text: "قطن مختار بعناية للرضع" },
          ].map((item) => (
            <div key={`desktop-${item.title}`} className="flex items-center justify-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background text-primary">
                <item.icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold">{item.title}</span>
                <span className="block text-xs text-muted-foreground">{item.text}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading
          title="وصل حديثًا"
          subtitle="أحدث القطع التي أضفناها إلى المتجر هذا الأسبوع."
          action={
            <Button variant="ghost" asChild className="hidden shrink-0 rounded-xl text-primary sm:inline-flex">
              <Link to="/products">عرض الكل</Link>
            </Button>
          }
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" asChild className="rounded-xl px-8">
            <Link to="/products">عرض جميع المنتجات</Link>
          </Button>
        </div>
      </section>

      <section className="bg-sand py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            title="تسوق حسب الفئة"
            subtitle="اختاروا الفئة المناسبة لعمر طفلكم واحتياجاته."
            action={
              <CarouselControls
                onPrev={() => categoriesCarousel.scroll("start")}
                onNext={() => categoriesCarousel.scroll("end")}
                canPrev={categoriesCarousel.canScrollStart}
                canNext={categoriesCarousel.canScrollEnd}
              />
            }
          />
          <div className="relative">
            <div
              ref={categoriesCarousel.scrollRef}
              onTouchStart={categoriesCarousel.onTouchStart}
              onTouchEnd={categoriesCarousel.onTouchEnd}
              className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 hide-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4 lg:px-0"
            >
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to="/category/$slug"
                  params={{ slug: cat.slug }}
                  className="group soft-card w-[17rem] shrink-0 overflow-hidden transition-shadow hover:shadow-card sm:w-auto"
                >
                  <div className="aspect-4/3 overflow-hidden">
                    <img
                      src={cat.imageUrl || ""}
                      alt={`فئة ${cat.name}`}
                      loading="lazy"
                      width={1000}
                      height={1000}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold">{cat.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {storeCategories.find(c => c.slug === cat.slug)?.description || ""}
                    </p>
                    <span className="mt-3 inline-block text-sm font-bold text-primary">
                      اكتشف المجموعة
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <SectionHeading title="جميع المنتجات" subtitle="ابحثوا وفلتروا بسهولة للوصول إلى ما يناسبكم." />
        <ProductBrowser source={products} categoriesSource={categories} />
      </section>

      <section className="bg-sand py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            title="باقات مميزة"
            subtitle="تشكيلات جاهزة بأسعار مميزة: اختاروا الباقة اللي تلبي احتياجات طفلكم."
            action={
              <div className="flex items-center gap-2">
                <CarouselControls
                  onPrev={() => bundlesCarousel.scroll("start")}
                  onNext={() => bundlesCarousel.scroll("end")}
                  canPrev={bundlesCarousel.canScrollStart}
                  canNext={bundlesCarousel.canScrollEnd}
                />
                <Button variant="ghost" asChild className="hidden shrink-0 rounded-xl text-primary sm:inline-flex">
                  <Link to="/bundles">عرض كل الباقات</Link>
                </Button>
              </div>
            }
          />
          <div className="relative">
            <div
              ref={bundlesCarousel.scrollRef}
              onTouchStart={bundlesCarousel.onTouchStart}
              onTouchEnd={bundlesCarousel.onTouchEnd}
              className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 hide-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3 lg:px-0"
            >
              {bundles.map((bundle) => (
                <div key={bundle.id} className="w-[18rem] shrink-0 sm:w-auto">
                  <BundleCard bundle={bundle} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="rounded-xl px-8">
              <Link to="/bundles">عرض كل الباقات</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary-soft py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <img
            src={brand}
            alt="أم تحمل رضيعها الملفوف ببطانية ناعمة"
            loading="lazy"
            width={1408}
            height={1008}
            className="h-60 w-full rounded-3xl object-cover shadow-card sm:h-80"
          />
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">تفاصيل صغيرة مليئة بالحب</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              في Happy Kids نختار كل قطعة كما نختارها لأطفالنا: أقمشة ناعمة، خياطة متينة وألوان
              هادئة تريح العين. هدفنا أن تكون تجربة التسوق سهلة ومطمئنة لكل أم وأب في الجزائر.
            </p>
            <Button asChild className="mt-6 rounded-xl px-8">
              <Link to="/about">تعرّفوا علينا</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
