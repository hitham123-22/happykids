import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, PackageCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import brand from "@/assets/brand.jpg";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | Happy Kids" },
      {
        name: "description",
        content:
          "قصة Happy Kids: علامة جزائرية تختار ملابس ومستلزمات الرضع والأطفال بعناية، برؤية تجمع الراحة والأناقة.",
      },
      { property: "og:title", content: "من نحن | Happy Kids" },
      { property: "og:description", content: "تعرّفوا على قصة ورؤية علامة Happy Kids الجزائرية." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="bg-primary-soft">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl lg:text-4xl">من نحن</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              نحن نؤمن أن عالم الأطفال يستحق تفاصيل صغيرة مليئة بالحب. بدأت Happy Kids من رغبة
              بسيطة: أن تجد كل أم وأب في الجزائر ملابس ومستلزمات أطفال بجودة حقيقية وسعر عادل، دون
              تعقيد ودون تنازل عن الراحة.
            </p>
          </div>
          <img
            src={brand}
            alt="أم تحمل رضيعها بلطف"
            loading="lazy"
            width={1408}
            height={1008}
            className="h-56 w-full rounded-3xl object-cover shadow-card sm:h-80"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <article className="soft-card p-6">
            <h2 className="text-lg font-bold">رؤيتنا</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              أن نكون العلامة الأولى التي تتذكرها العائلة الجزائرية عند التفكير في ملابس أطفالها:
              ذوق هادئ، جودة ثابتة وخدمة مطمئنة.
            </p>
          </article>
          <article className="soft-card p-6">
            <h2 className="text-lg font-bold">مهمتنا</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              انتقاء قطع مريحة بأقمشة لطيفة على بشرة الأطفال، وتقديمها بتجربة شراء بسيطة وسريعة مع
              التوصيل إلى كل الولايات.
            </p>
          </article>
        </div>

        <h2 className="mt-14 mb-6 text-xl font-extrabold sm:text-2xl">لماذا نحن؟</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "جودة المنتجات",
              text: "أقمشة قطنية ناعمة وخياطة متينة تتحمّل الغسل المتكرر.",
            },
            {
              icon: PackageCheck,
              title: "اختيار بعناية",
              text: "نجرّب ونختار كل قطعة قبل إضافتها إلى المتجر.",
            },
            {
              icon: HeartHandshake,
              title: "خدمة العملاء",
              text: "فريق يرد بسرعة على أسئلتكم قبل وبعد الطلب.",
            },
          ].map((item) => (
            <article key={item.title} className="soft-card p-6">
              <span className="grid size-11 place-items-center rounded-full bg-primary-soft text-primary">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-2">
          <img
            src={hero}
            alt="أطفال يرتدون ملابس من تشكيلة Happy Kids"
            loading="lazy"
            width={1600}
            height={1200}
            className="h-56 w-full rounded-3xl object-cover sm:h-72"
          />
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">تشكيلة جديدة كل موسم</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              نحدّث التشكيلة باستمرار حسب الموسم واحتياجات العائلات، من ملابس المواليد إلى تجهيزات
              النوم والأكسسوارات.
            </p>
            <Button asChild className="mt-6 rounded-xl px-8">
              <Link to="/products">تصفّح المنتجات</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
