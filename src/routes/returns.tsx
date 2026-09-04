import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "سياسة الاستبدال والاسترجاع | Happy Kids" },
      {
        name: "description",
        content: "شروط استبدال واسترجاع منتجات Happy Kids خلال 48 ساعة من الاستلام.",
      },
      { property: "og:title", content: "سياسة الاستبدال والاسترجاع | Happy Kids" },
      { property: "og:description", content: "كل ما تحتاجون معرفته عن الاستبدال والاسترجاع." },
      { property: "og:url", content: "/returns" },
    ],
    links: [{ rel: "canonical", href: "/returns" }],
  }),
  component: () => (
    <PolicyPage
      title="سياسة الاستبدال والاسترجاع"
      intro="راحتكم أولويتنا، ولذلك نوفّر إمكانية الاستبدال أو الاسترجاع وفق الشروط التالية."
      sections={[
        {
          heading: "مدة الاستبدال",
          body: "يمكنكم طلب الاستبدال خلال 48 ساعة من استلام الطلب، مع الاتصال بنا هاتفيًا أو عبر واتساب.",
        },
        {
          heading: "حالة المنتج",
          body: "يجب أن يكون المنتج في حالته الأصلية، غير مستعمل وغير مغسول، مع العلامات والتغليف الأصلي.",
        },
        {
          heading: "أخطاء الطلب",
          body: "إذا استلمتم منتجًا مختلفًا عن الذي طلبتموه أو به عيب في التصنيع، نتحمّل نحن كلفة الاستبدال وإعادة التوصيل.",
        },
        {
          heading: "استرجاع المبلغ",
          body: "في حال عدم توفّر بديل، يتم استرجاع المبلغ المدفوع كاملًا عدا مصاريف التوصيل الأصلية.",
        },
        {
          heading: "منتجات غير قابلة للاستبدال",
          body: "لأسباب صحية، لا يمكن استبدال الملابس الداخلية والجوارب بعد فتح تغليفها.",
        },
      ]}
    />
  ),
});
