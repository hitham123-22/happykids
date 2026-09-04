import { createFileRoute } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | Happy Kids" },
      {
        name: "description",
        content:
          "تواصلوا مع فريق Happy Kids عبر الهاتف، واتساب أو النموذج، وزوروا محلنا في الجزائر العاصمة.",
      },
      { property: "og:title", content: "تواصل معنا | Happy Kids" },
      { property: "og:description", content: "هاتف، واتساب، عنوان المحل وأوقات العمل." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">تواصل معنا</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          نحن هنا للإجابة عن أسئلتكم حول المنتجات، المقاسات أو التوصيل.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="soft-card p-5">
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href="tel:+213771264245" dir="ltr">
                  +213 771 26 42 45
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-primary" />
                <a href="https://wa.me/213771264245" target="_blank" rel="noreferrer">
                  واتساب
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-primary" />
                <a href="mailto:contact@happykids.dz">contact@happykids.dz</a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="size-4 shrink-0 text-primary" />
                <a href="https://www.instagram.com/happy_kids774?igsi=NHkzaDhmempjb3F1&utm_source=qr" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Facebook className="size-4 shrink-0 text-primary" />
                <a href="https://www.facebook.com/share/1E9whkJCWE/?mibextid=wwXIfr" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0 text-primary" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                <a href="https://www.tiktok.com/@happykids079?_r=1&_t=ZS-99NbaEdt56K" target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>حي النصر، شارع ديدوش مراد، الجزائر العاصمة</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  السبت – الخميس: 09:00 – 18:00
                  <br />
                  الجمعة: مغلق
                </span>
              </li>
            </ul>
          </div>

          <div className="soft-card overflow-hidden">
            <iframe
              title="موقع محل Happy Kids على الخريطة"
              src="https://www.google.com/maps?q=Alger,+Algeria&output=embed"
              loading="lazy"
              className="h-56 w-full border-0"
            />
          </div>
        </div>

        <form
          className="soft-card space-y-5 p-5"
          onSubmit={(event) => {
            event.preventDefault();
            event.currentTarget.reset();
            toast.success("تم إرسال رسالتكم، سنتواصل معكم قريبًا");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="c-name">الاسم</Label>
              <Input id="c-name" name="name" required className="mt-2 h-11 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="c-phone">رقم الهاتف</Label>
              <Input
                id="c-phone"
                name="phone"
                inputMode="tel"
                required
                className="mt-2 h-11 rounded-xl"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="c-email">البريد الإلكتروني</Label>
            <Input id="c-email" name="email" type="email" className="mt-2 h-11 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="c-message">الرسالة</Label>
            <Textarea id="c-message" name="message" rows={6} required className="mt-2 rounded-xl" />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-xl sm:w-auto sm:px-10">
            إرسال الرسالة
          </Button>
        </form>
      </div>
    </div>
  );
}
