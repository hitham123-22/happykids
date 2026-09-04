import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SHIPPING_COST } from "@/data/store";
import { useProducts, type Product } from "@/lib/products";

export type CartItem = {
  key: string;
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  ready: boolean;
  add: (product: Product, size: string, color: string, quantity?: number) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "happykids-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    const shipping = items.length ? SHIPPING_COST : 0;

    return {
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      ready,
      add: (product, size, color, quantity = 1) => {
        const key = `${product.id}|${size}|${color}`;
        setItems((prev) => {
          const found = prev.find((i) => i.key === key);
          if (found) {
            return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
          }
          return [...prev, { key, productId: product.id, size, color, quantity }];
        });
      },
      remove: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
      setQuantity: (key, quantity) =>
        setItems((prev) =>
          prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)),
        ),
      clear: () => setItems([]),
    };
  }, [items, ready, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
