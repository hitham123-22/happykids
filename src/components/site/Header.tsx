import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/lib/cart";
import { categories, formatPrice, products } from "@/data/store";

const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/products", label: "المنتجات" },
  { to: "/categories", label: "الأصناف" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

function SearchBox({ onDone }: { onDone: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const results = query.trim()
    ? products.filter((p) => p.name.includes(query.trim())).slice(0, 6)
    : [];

  return (
    <div className="space-y-4">
      <DialogTitle className="text-lg">البحث عن منتج</DialogTitle>
      <Input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="اكتب اسم المنتج..."
        className="h-12 rounded-xl"
      />
      {query.trim() && results.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          لا توجد نتائج مطابقة لبحثكم.
        </p>
      )}
      <ul className="space-y-2">
        {results.map((product) => (
          <li key={product.id}>
            <Link
              to="/products/$slug"
              params={{ slug: product.slug }}
              onClick={onDone}
              className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                width={900}
                height={900}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{product.name}</span>
                <span className="block text-xs text-primary">{formatPrice(product.price)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {query.trim() && (
        <Button
          variant="outline"
          className="w-full rounded-xl"
          onClick={() => {
            onDone();
            navigate({ to: "/products", search: { q: query.trim() } });
          }}
        >
          عرض كل النتائج في المنتجات
        </Button>
      )}
    </div>
  );
}

export function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 sm:h-20 sm:px-6">
        <div className="flex items-center gap-1">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="القائمة">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs p-6">
              <div className="mb-8">
                <Logo />
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-semibold transition-colors hover:bg-muted"
                    activeProps={{ className: "bg-primary-soft text-primary" }}
                    activeOptions={{ exact: link.to === "/" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <p className="mt-8 mb-2 text-xs font-semibold text-muted-foreground">الفئات</p>
              <nav className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to="/category/$slug"
                    params={{ slug: cat.slug }}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="hidden lg:block">
            <Logo />
          </div>
        </div>

        <div className="flex min-w-0 justify-center lg:justify-start">
          <div className="lg:hidden">
            <Logo />
          </div>
          <nav className="hidden items-center gap-1 lg:flex lg:ps-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "bg-primary-soft text-primary" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="بحث">
                <Search className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl p-5 [&>button:last-child]:hidden">
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="إغلاق"
                className="absolute start-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
              <SearchBox onDone={() => setSearchOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="الحساب">
            <User className="size-5" />
          </Button>

          <Button variant="ghost" size="icon" asChild aria-label="سلة المشتريات">
            <Link to="/cart" className="relative">
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -end-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
