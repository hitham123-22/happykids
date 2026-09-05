import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { toast } from "sonner";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
  createdAt: string;
  bundleItems?: string[];
  stock: number;
  is_bundle?: boolean;
};

type ProductsContextType = {
  products: Product[];
  isLoading: boolean;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["client_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, category:categories(slug)`)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("فشل في جلب المنتجات");
        throw error;
      }

      return data.map((item) => ({
        id: item.id,
        slug: item.id.substring(0, 8), // We don't have a slug column yet, so use a portion of the id or add a slug
        name: item.name,
        category: item.category?.slug || "uncategorized",
        price: item.price,
        images: item.image_url ? [item.image_url.replace('/src/assets/', '/assets/')] : [],
        description: item.description || "",
        sizes: item.sizes || [],
        colors: item.colors || [],
        inStock: item.stock > 0,
        stock: item.stock,
        isNew: true, // Mocking these for now
        bestSeller: false,
        createdAt: item.created_at,
        is_bundle: item.is_bundle || false,
        bundleItems: item.bundle_items || [],
      })) as Product[];
    },
  });

  return (
    <ProductsContext.Provider value={{ products, isLoading }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
}
