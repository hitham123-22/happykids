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
import { Plus, MoreHorizontal, Store, DollarSign, Boxes, Percent, ImagePlus, Sparkles, Loader2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/lib/categories";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

const PREDEFINED_COLORS = [
  { name: "أحمر", hex: "#ef4444" },
  { name: "أزرق", hex: "#3b82f6" },
  { name: "أخضر", hex: "#22c55e" },
  { name: "أصفر", hex: "#eab308" },
  { name: "أسود", hex: "#000000" },
  { name: "أبيض", hex: "#ffffff" },
  { name: "وردي", hex: "#ec4899" },
  { name: "رمادي", hex: "#6b7280" },
];

function AdminProducts() {
  const { categories } = useCategories();
  const queryClient = useQueryClient();
  
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`*, category:categories(name)`)
        .order("created_at", { ascending: false });
        
      if (error) {
        toast.error("فشل في جلب المنتجات");
        throw error;
      }
      return data;
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  
  // States for AI Color feature
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeInputValue, setSizeInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Dynamic colors list
  const [availableColors, setAvailableColors] = useState(PREDEFINED_COLORS);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev => 
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleAddCustomSize = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && sizeInputValue.trim()) {
      e.preventDefault();
      const newSize = sizeInputValue.trim();
      if (!selectedSizes.includes(newSize)) {
        setSelectedSizes(prev => [...prev, newSize]);
      }
      setSizeInputValue("");
    }
  };

  const handleAddCustomColor = () => {
    if (newColorName.trim()) {
      const newColor = { name: newColorName.trim(), hex: newColorHex };
      setAvailableColors(prev => [...prev, newColor]);
      setSelectedColors(prev => [...prev, newColor.name]); // Select it automatically
      setIsAddingColor(false);
      setNewColorName("");
    }
  };

  const addMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      const { data, error } = await supabase.from("products").insert([newProduct]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تمت إضافة المنتج بنجاح");
      setIsAddModalOpen(false);
      // Reset form
      setProductName("");
      setPurchasePrice("");
      setSellingPrice("");
      setStockQuantity("");
      setSelectedSizes([]);
      setSelectedColors([]);
      setImagePreview(null);
    },
    onError: (err) => {
      console.error(err);
      toast.error("حدث خطأ أثناء إضافة المنتج");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("تم حذف المنتج بنجاح");
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, newStock }: { id: string, newStock: number }) => {
      const { error } = await supabase.from("products").update({ stock: newStock }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !sellingPrice) {
      toast.error("يرجى ملء الحقول الأساسية");
      return;
    }
    
    // Find category ID
    const catId = categories.find(c => c.name === productCategory)?.id;

    addMutation.mutate({
      name: productName,
      price: parseFloat(sellingPrice),
      category_id: catId || null,
      image_url: imagePreview || null,
      colors: selectedColors,
      sizes: selectedSizes,
      stock: parseInt(stockQuantity || "0")
    });
  };

  const updateQuantity = (id: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    updateQuantityMutation.mutate({ id, newStock });
  };

  const deleteProduct = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        simulateAIColorDetection();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIColorDetection = () => {
    setIsAnalyzing(true);
    setSelectedColors([]); // Reset colors while analyzing
    
    // Simulate AI processing delay
    setTimeout(() => {
      setIsAnalyzing(false);
      // Pick dynamic colors for demo (e.g. blue and white)
      setSelectedColors(["أزرق", "أبيض"]);
    }, 2500);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setSelectedColors([]);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">إدارة المنتجات</h2>
          <p className="text-muted-foreground mt-2">إضافة، تعديل، ومراقبة حالة مخزون منتجاتك.</p>
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if(!open) {
            setImagePreview(null);
            setSelectedColors([]);
          }
        }}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              <Plus className="me-2 h-5 w-5" /> إضافة منتج جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold text-primary">منتج جديد</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل المنتج الجديد ليتم إضافته إلى متجرك.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center justify-between">
                  صورة المنتج
                  {isAnalyzing && (
                    <span className="text-xs text-primary flex items-center gap-1 animate-pulse">
                      <Sparkles className="h-3 w-3" /> جاري تحليل الألوان بالذكاء الاصطناعي...
                    </span>
                  )}
                </Label>
                
                <Label 
                  htmlFor="image-upload"
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer overflow-hidden group",
                    imagePreview ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50",
                    isAnalyzing && "pointer-events-none opacity-80"
                  )}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="h-40 w-full object-contain rounded-lg" />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={clearImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
                          <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 animate-scan"></div>
                          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                        <ImagePlus className="h-6 w-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-primary">انقر لرفع صورة</p>
                        <p className="text-xs text-muted-foreground">الذكاء الاصطناعي سيقوم بتحديد ألوانها تلقائياً</p>
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
                <Label htmlFor="name" className="text-sm font-medium">اسم المنتج</Label>
                <Input id="name" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="مثال: قميص أطفال قطني" className="focus-visible:ring-primary" />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">القسم / الفئة</Label>
                <Select value={productCategory} onValueChange={setProductCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice" className="text-sm font-medium">سعر الشراء (د.ج)</Label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="purchasePrice" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} type="number" placeholder="800" className="pl-3 pr-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice" className="text-sm font-medium">سعر البيع (د.ج)</Label>
                  <div className="relative">
                    <Store className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="sellingPrice" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} type="number" placeholder="1200" className="pl-3 pr-9" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">الكمية المتوفرة بالمخزون</Label>
                <div className="relative">
                  <Boxes className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="quantity" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} type="number" placeholder="50" className="pl-3 pr-9" />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-muted/30 rounded-xl border border-muted-foreground/10">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">المقاسات المتاحة للمنتج</Label>
                  
                  {/* Selected Sizes Tags */}
                  <div className="flex flex-wrap gap-2 min-h-[32px] p-2 bg-background border rounded-md">
                    {selectedSizes.length === 0 && (
                      <span className="text-sm text-muted-foreground flex items-center h-6 px-1">لم يتم تحديد مقاسات...</span>
                    )}
                    {selectedSizes.map(size => (
                      <Badge key={size} variant="secondary" className="flex items-center gap-1 pe-1">
                        {size}
                        <button 
                          type="button" 
                          onClick={() => toggleSize(size)}
                          className="h-4 w-4 rounded-full hover:bg-muted-foreground/20 flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <input 
                      type="text" 
                      value={sizeInputValue}
                      onChange={(e) => setSizeInputValue(e.target.value)}
                      onKeyDown={handleAddCustomSize}
                      placeholder="اكتب مقاساً مخصصاً واضغط Enter..."
                      className="flex-1 bg-transparent border-0 outline-none text-sm min-w-[150px] focus:ring-0 p-0 h-6"
                    />
                  </div>

                  {/* Quick Select Sizes */}
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">مقاسات شائعة (انقر للإضافة):</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["XS", "S", "M", "L", "XL", "0-3 أشهر", "3-6 أشهر", "6-12 شهر", "1-2 سنة", "2-3 سنوات"].map(size => (
                        <Badge 
                          key={size} 
                          variant="outline" 
                          className={cn(
                            "cursor-pointer hover:bg-primary/10 transition-colors text-xs font-normal",
                            selectedSizes.includes(size) && "bg-primary/10 border-primary text-primary"
                          )}
                          onClick={() => toggleSize(size)}
                        >
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-muted-foreground/10">
                <Label className="text-sm font-medium flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    الألوان المتاحة
                    {selectedColors.length > 0 && !isAnalyzing && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Sparkles className="h-3 w-3 me-1" /> تم التحديد آلياً
                      </Badge>
                    )}
                  </span>
                </Label>
                <div className="flex flex-wrap gap-3 items-center">
                  {availableColors.map((color) => {
                    const isSelected = selectedColors.includes(color.name);
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => toggleColor(color.name)}
                        className={cn(
                          "group relative flex items-center gap-2 rounded-full border py-1.5 px-3 text-sm transition-all hover:bg-muted/80",
                          isSelected ? "border-primary bg-primary/5 font-medium text-primary shadow-sm" : "border-border text-muted-foreground"
                        )}
                      >
                        <span 
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-black/10 shadow-sm transition-transform group-hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && color.hex !== "#ffffff" && <Check className="h-2.5 w-2.5 text-white drop-shadow-md" />}
                          {isSelected && color.hex === "#ffffff" && <Check className="h-2.5 w-2.5 text-black" />}
                        </span>
                        {color.name}
                      </button>
                    );
                  })}
                  
                  {!isAddingColor ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingColor(true)}
                      className="flex items-center justify-center h-8 w-8 rounded-full border border-dashed border-muted-foreground/50 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      title="إضافة لون جديد"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-background p-1.5 rounded-full border shadow-sm animate-in fade-in zoom-in-95">
                      <input 
                        type="color" 
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="h-6 w-6 rounded-full cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <Input 
                        placeholder="اسم اللون" 
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        className="h-6 w-24 text-xs border-0 focus-visible:ring-0 px-1"
                        autoFocus
                      />
                      <div className="flex gap-1 border-s ps-1">
                        <button type="button" onClick={handleAddCustomColor} className="h-6 w-6 flex items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-50"><Check className="h-3 w-3" /></button>
                        <button type="button" onClick={() => setIsAddingColor(false)} className="h-6 w-6 flex items-center justify-center rounded-full text-destructive hover:bg-destructive/10"><X className="h-3 w-3" /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Card className="bg-primary/5 border-primary/20 mt-2">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">هامش الربح المتوقع:</span>
                  <Badge variant="outline" className="bg-background text-primary border-primary flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    سيتم حسابه تلقائياً
                  </Badge>
                </CardContent>
              </Card>

            </div>
            <DialogFooter className="mt-4 flex-col-reverse sm:flex-row gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">إلغاء</Button>
              </DialogClose>
              <Button onClick={handleAddProduct} disabled={addMutation.isPending} className="w-full sm:w-auto">
                {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : null}
                حفظ المنتج
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[80px] font-bold">المعرف</TableHead>
              <TableHead className="font-bold">اسم المنتج</TableHead>
              <TableHead className="font-bold">القسم</TableHead>
              <TableHead className="font-bold">المقاسات</TableHead>
              <TableHead className="font-bold">الألوان</TableHead>
              <TableHead className="font-bold">الكمية</TableHead>
              <TableHead className="font-bold">التكلفة (شراء)</TableHead>
              <TableHead className="font-bold text-primary">سعر البيع</TableHead>
              <TableHead className="font-bold text-center">الربح</TableHead>
              <TableHead className="font-bold">الحالة</TableHead>
              <TableHead className="text-end font-bold">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isProductsLoading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
                  لا توجد منتجات حالياً. أضف منتجاً جديداً!
                </TableCell>
              </TableRow>
            ) : products.map((product: any) => {
              const purchasePrice = 0; // Purchase price is not in schema currently, defaulting to 0 or we can derive it
              const sellingPrice = product.price || 0;
              const profit = sellingPrice - purchasePrice;
              
              let status = "نشط";
              if (product.stock === 0) status = "غير متوفر";
              else if (product.stock < 20) status = "مخزون منخفض";
              
              const productCategoryName = product.category?.name || "بدون قسم";
              
              return (
                <TableRow key={product.id} className="hover:bg-muted/30 transition-colors group">
                  <TableCell className="font-medium text-muted-foreground w-[80px]">#{product.id?.substring(0,6)}</TableCell>
                  <TableCell className="font-bold min-w-[120px] max-w-[180px] whitespace-normal break-words">{product.name}</TableCell>
                  <TableCell className="min-w-[100px] whitespace-normal">
                    <Badge variant="outline" className="font-normal bg-muted/20">
                      {productCategoryName}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-[120px] max-w-[180px] whitespace-normal">
                    <div className="flex flex-wrap gap-1">
                      {(product.sizes || []).map((size: string) => (
                        <Badge key={size} variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-background">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(product.colors || []).map((color: string) => {
                        const colorData = PREDEFINED_COLORS.find(c => c.name === color);
                        return (
                          <div key={color} className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-0.5 border">
                            {colorData && (
                              <span 
                                className="h-2 w-2 rounded-full border border-black/10" 
                                style={{ backgroundColor: colorData.hex }}
                              />
                            )}
                            <span className="text-[10px] text-muted-foreground font-medium">{color}</span>
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateQuantity(product.id, product.stock, -1)}
                        disabled={product.stock === 0}
                      >
                        <span className="font-bold">-</span>
                      </Button>
                      <span className={cn("w-6 text-center font-bold text-sm", product.stock === 0 ? "text-destructive" : product.stock < 20 ? "text-orange-500" : "")}>
                        {product.stock}
                      </span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-6 w-6 rounded-full"
                        onClick={() => updateQuantity(product.id, product.stock, 1)}
                      >
                        <span className="font-bold">+</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{purchasePrice} د.ج</TableCell>
                  <TableCell className="font-bold text-primary">{sellingPrice} د.ج</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                      +{profit} د.ج
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        status === "نشط" ? "default" :
                        status === "مخزون منخفض" ? "secondary" : "destructive"
                      }
                      className={
                        status === "نشط" ? "bg-emerald-500 hover:bg-emerald-600" :
                        status === "مخزون منخفض" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""
                      }
                    >
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setIsAddModalOpen(true)}
                        title="تعديل"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteProduct(product.id)}
                        title="حذف"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
