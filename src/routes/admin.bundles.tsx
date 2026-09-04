import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Tags, DollarSign, ImagePlus, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bundles")({
  component: AdminBundles,
});

function AdminBundles() {
  const queryClient = useQueryClient();
  
  // Fetch only bundles
  const { data: bundles = [], isLoading: isBundlesLoading } = useQuery({
    queryKey: ["bundles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*`)
        .eq("is_bundle", true)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch only normal products to choose from
  const { data: normalProducts = [], isLoading: isNormalProductsLoading } = useQuery({
    queryKey: ["normal_products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`id, name, price, stock, image_url`)
        .eq("is_bundle", false)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data;
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bundleName, setBundleName] = useState("");
  const [bundlePrice, setBundlePrice] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const addMutation = useMutation({
    mutationFn: async (newBundle: any) => {
      const { data, error } = await supabase.from("products").insert([newBundle]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      toast.success("تمت إضافة الباقة بنجاح");
      setIsAddModalOpen(false);
      // Reset form
      setBundleName("");
      setBundlePrice("");
      setSelectedProductIds([]);
      setImagePreview(null);
    },
    onError: (err) => {
      console.error(err);
      toast.error("حدث خطأ أثناء إضافة الباقة");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      toast.success("تم حذف الباقة بنجاح");
    }
  });

  const handleAddBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleName || !bundlePrice) {
      toast.error("يرجى ملء الحقول الأساسية");
      return;
    }
    if (selectedProductIds.length === 0) {
      toast.error("يرجى اختيار منتج واحد على الأقل للباقة");
      return;
    }

    addMutation.mutate({
      name: bundleName,
      price: parseFloat(bundlePrice),
      image_url: imagePreview || null,
      is_bundle: true,
      bundle_items: selectedProductIds,
      stock: 100 // default stock for bundles, or could be computed from items
    });
  };

  const deleteBundle = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الباقة؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
  };

  // Calculate total original price of selected products
  const selectedProductsTotal = selectedProductIds.reduce((sum, id) => {
    const prod = normalProducts.find((p: any) => p.id === id);
    return sum + (prod ? prod.price : 0);
  }, 0);

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">الباقات المميزة</h2>
          <p className="text-muted-foreground mt-2">تجميع المنتجات في باقات وبيعها بأسعار خاصة.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if(!open) {
            setImagePreview(null);
            setSelectedProductIds([]);
          }
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              <Plus className="me-2 h-5 w-5" /> إضافة باقة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-primary">باقة جديدة</DialogTitle>
              <DialogDescription>
                قم باختيار المنتجات التي تريد وضعها في هذه الباقة.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-2 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center justify-between">
                    صورة الباقة
                  </Label>
                  
                  <Label 
                    htmlFor="image-upload"
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer overflow-hidden group h-32",
                      imagePreview ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
                    )}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={clearImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                          <ImagePlus className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-primary">انقر لرفع صورة للباقة</p>
                        </div>
                      </>
                    )}
                    <Input 
                      id="image-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                    />
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">اسم الباقة</Label>
                  <Input id="name" value={bundleName} onChange={(e) => setBundleName(e.target.value)} placeholder="مثال: باقة الصيف للمواليد" className="focus-visible:ring-primary" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bundlePrice" className="text-sm font-medium">سعر الباقة (د.ج)</Label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="bundlePrice" value={bundlePrice} onChange={(e) => setBundlePrice(e.target.value)} type="number" placeholder="4500" className="pl-3 pr-9" />
                  </div>
                  {selectedProductsTotal > 0 && (
                    <p className="text-xs text-muted-foreground">السعر الأصلي للمنتجات: <span className="line-through">{selectedProductsTotal}</span> د.ج</p>
                  )}
                </div>
              </div>

              {/* Right column: Product Selection */}
              <div className="space-y-2 bg-muted/30 p-4 rounded-xl border">
                <Label className="text-sm font-bold flex items-center justify-between mb-2">
                  اختيار المنتجات ({selectedProductIds.length})
                </Label>
                
                {isNormalProductsLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pe-2">
                    {normalProducts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center">لا توجد منتجات عادية في المخزون.</p>
                    )}
                    {normalProducts.map((prod: any) => {
                      const isSelected = selectedProductIds.includes(prod.id);
                      return (
                        <div 
                          key={prod.id} 
                          onClick={() => toggleProduct(prod.id)}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors",
                            isSelected ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-background rounded border overflow-hidden">
                              {prod.image_url ? (
                                <img src={prod.image_url} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">صورة</div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium leading-none">{prod.name}</span>
                              <span className="text-xs text-muted-foreground mt-1">{prod.price} د.ج</span>
                            </div>
                          </div>
                          {isSelected && (
                            <Badge className="bg-primary hover:bg-primary">مضاف</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="mt-4 flex-col-reverse sm:flex-row gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">إلغاء</Button>
              </DialogClose>
              <Button onClick={handleAddBundle} disabled={addMutation.isPending} className="w-full sm:w-auto">
                {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : null}
                حفظ الباقة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px] font-bold">صورة</TableHead>
              <TableHead className="font-bold">اسم الباقة</TableHead>
              <TableHead className="font-bold">عدد المنتجات</TableHead>
              <TableHead className="font-bold text-primary">السعر</TableHead>
              <TableHead className="text-end font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isBundlesLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : bundles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  لا توجد باقات حالياً. أضف باقة جديدة!
                </TableCell>
              </TableRow>
            ) : bundles.map((bundle: any) => (
              <TableRow key={bundle.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="h-12 w-12 rounded-lg border overflow-hidden bg-muted">
                    {bundle.image_url ? (
                      <img src={bundle.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Tags className="h-6 w-6 m-3 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-bold">{bundle.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {bundle.bundle_items ? bundle.bundle_items.length : 0} منتجات
                  </Badge>
                </TableCell>
                <TableCell className="font-bold text-primary">{bundle.price} د.ج</TableCell>
                <TableCell className="text-end">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteBundle(bundle.id)}
                    title="حذف"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
