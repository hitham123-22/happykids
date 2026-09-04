import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والأحكام | Happy Kids" },
      {
        name: "description",
        content: "شروط الطلب، الأسعار، التوصيل والدفع عند الاستلام في متجر Happy Kids.",
      },
      { property: "og:title", content: "الشروط والأحكام | Happy Kids" },
      { property: "og:description", content: "شروط استخدام متجر Happy Kids وإتمام الطلبات." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <PolicyPage
      title="الشروط والأحكام"
      intro="باستخدامكم متجر Happy Kids وإتمام طلب، فإنكم توافقون على الشروط التالية."
      sections={[
        {
          heading: "الطلبات",
          body: "يتم تأكيد كل طلب هاتفيًا. في حال عدم الرد على ثلاث محاولات اتصال، يمكن إلغاء الطلب تلقائيًا.",
        },
        {
          heading: "الأسعار",
          body: "جميع الأسعار معروضة بالدينار الجزائري وتشمل رسوم المنتج فقط، أما التوصيل فيُحسب بشكل منفصل.",
        },
        {
          heading: "التوصيل",
          body: "التوصيل متوفر لكل الولايات عبر شركات التوصيل، ومدة التسليم عادة من 2 إلى 5 أيام عمل.",
        },
        {
          heading: "الدفع",
          body: "طريقة الدفع الحالية هي الدفع عند الاستلام، ويحق لكم فحص الطلب قبل الدفع.",
        },
        {
          heading: "توفّر المنتجات",
          body: "قد ينتهي مخزون بعض المقاسات أو الألوان، وفي هذه الحالة نتواصل معكم لاقتراح بديل مناسب.",
        },
      ]}
    />
  ),
});
