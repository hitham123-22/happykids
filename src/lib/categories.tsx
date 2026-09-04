import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import { toast } from "sonner";

export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string; // mapping from image_url
};

type CategoriesContextType = {
  categories: Category[];
  addCategory: (name: string, imageUrl?: string) => void;
  removeCategory: (id: string) => void;
  isLoading: boolean;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("فشل في جلب الأقسام");
        throw error;
      }

      return data.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        imageUrl: item.image_url,
      })) as Category[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ name, slug, imageUrl }: { name: string; slug: string; imageUrl?: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name, slug, image_url: imageUrl }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("تم إضافة القسم بنجاح");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء إضافة القسم");
      console.error(error);
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("تم حذف القسم بنجاح");
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء حذف القسم");
      console.error(error);
    }
  });

  const addCategory = (name: string, imageUrl?: string) => {
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
    addMutation.mutate({ name, slug, imageUrl });
  };

  const removeCategory = (id: string) => {
    removeMutation.mutate(id);
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, removeCategory, isLoading }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
}
