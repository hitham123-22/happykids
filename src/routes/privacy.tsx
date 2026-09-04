import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/PolicyPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية | Happy Kids" },
      {
        name: "description",
        content: "كيف نجمع ونحمي معلوماتكم الشخصية عند التسوق من متجر Happy Kids.",
      },
      { property: "og:title", content: "سياسة الخصوصية | Happy Kids" },
      { property: "og:description", content: "حماية بياناتكم الشخصية في متجر Happy Kids." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <PolicyPage
      title="سياسة الخصوصية"
      intro="نحترم خصوصيتكم ونستخدم معلوماتكم فقط لتنفيذ الطلبات وتحسين تجربة التسوق."
      sections={[
        {
          heading: "المعلومات التي نجمعها",
          body: "الاسم، رقم الهاتف، الولاية، البلدية والعنوان، وهي معلومات ضرورية لتوصيل الطلب.",
        },
        {
          heading: "استخدام المعلومات",
          body: "نستخدم بياناتكم لتأكيد الطلب، التوصيل، وخدمة ما بعد البيع فقط، ولا نستخدمها لأي غرض آخر.",
        },
        {
          heading: "مشاركة المعلومات",
          body: "نشارك عنوان التوصيل ورقم الهاتف مع شركة التوصيل فقط، ولا نبيع بياناتكم لأي طرف ثالث.",
        },
        {
          heading: "حماية البيانات",
          body: "نعتمد إجراءات تقنية وتنظيمية لحماية معلوماتكم من الوصول غير المصرّح به.",
        },
        {
          heading: "حقوقكم",
          body: "يمكنكم طلب تعديل أو حذف بياناتكم في أي وقت بالتواصل معنا عبر صفحة تواصل معنا.",
        },
      ]}
    />
  ),
});
