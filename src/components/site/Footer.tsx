import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { categories } from "@/data/store";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-sand">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            علامة جزائرية متخصصة في ملابس الرضع والأطفال، الأكسسوارات وتجهيزات الأطفال. نختار كل
            قطعة بعناية لتمنح طفلكم الراحة والأناقة.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-primary">
                المنتجات
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-primary">
                الأصناف
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                من نحن
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                تواصل معنا
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold">خدمة العملاء</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/returns" className="hover:text-primary">
                سياسة الاستبدال والاسترجاع
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-primary">
                سياسة الخصوصية
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-primary">
                الشروط والأحكام
              </Link>
            </li>
            {categories.slice(0, 2).map((cat) => (
              <li key={cat.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: cat.slug }}
                  className="hover:text-primary"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold">معلومات التواصل</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href="tel:+213771264245" dir="ltr">
                +213 771 26 42 45
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href="https://wa.me/213771264245" target="_blank" rel="noreferrer">
                واتساب
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="size-4 shrink-0 text-primary" />
              <a href="https://www.instagram.com/happy_kids774?igsi=NHkzaDhmempjb3F1&utm_source=qr" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Facebook className="size-4 shrink-0 text-primary" />
              <a href="https://www.facebook.com/share/1E9whkJCWE/?mibextid=wwXIfr" target="_blank" rel="noreferrer">
                Facebook
              </a>
            </li>
            <li className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 shrink-0 text-primary" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              <a href="https://www.tiktok.com/@happykids079?_r=1&_t=ZS-99NbaEdt56K" target="_blank" rel="noreferrer">
                TikTok
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>حي النصر، شارع ديدوش مراد، الجزائر العاصمة</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © 2026 Happy Kids — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
