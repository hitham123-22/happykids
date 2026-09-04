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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Wand2, Loader2, Image as ImageIcon } from "lucide-react";
import { useCategories } from "@/lib/categories";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { categories, addCategory, removeCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateImage = () => {
    if (!newCategoryName.trim()) return;
    setIsGenerating(true);
    
    // Simulate AI generation matching site colors (soft, premium kids theme)
    setTimeout(() => {
      const generatedImages = [
        "https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=400&auto=format&fit=crop", // Soft kids room
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=400&auto=format&fit=crop", // Kids toys/clothes
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=400&auto=format&fit=crop", // Child
        "https://images.unsplash.com/photo-1471286174890-9c11241eb058?q=80&w=400&auto=format&fit=crop", // Baby shoes
      ];
      setNewCategoryImage(generatedImages[Math.floor(Math.random() * generatedImages.length)]);
      setIsGenerating(false);
    }, 2500);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName, newCategoryImage || undefined);
      setNewCategoryName("");
      setNewCategoryImage(null);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">الفئات والأقسام</h2>
          <p className="text-muted-foreground mt-2">إدارة الأقسام في متجرك لتنظيم المنتجات بشكل أفضل.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              <Plus className="me-2 h-5 w-5" /> إضافة قسم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-primary">قسم جديد</DialogTitle>
              <DialogDescription>
                أدخل اسم القسم الجديد. يمكنك استخدام الذكاء الاصطناعي لتوليد صورة تناسب هوية متجرك.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">اسم القسم</Label>
                <Input 
                  id="category-name" 
                  placeholder="مثال: أحذية أطفال, تجهيزات رضع..." 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>صورة القسم</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 text-primary border-primary/20 hover:bg-primary/5"
                    disabled={!newCategoryName.trim() || isGenerating}
                    onClick={handleGenerateImage}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-3 w-3 me-1 animate-spin" />
                    ) : (
                      <Wand2 className="h-3 w-3 me-1" />
                    )}
                    توليد بالذكاء الاصطناعي
                  </Button>
                </div>
                
                <div className="border-2 border-dashed rounded-xl overflow-hidden h-40 bg-muted/30 flex items-center justify-center relative transition-all">
                  {isGenerating ? (
                    <div className="flex flex-col items-center text-primary/60">
                      <Wand2 className="h-8 w-8 animate-bounce mb-2" />
                      <span className="text-sm font-medium animate-pulse">جاري تحليل "{newCategoryName}"...</span>
                    </div>
                  ) : newCategoryImage ? (
                    <img src={newCategoryImage} alt={newCategoryName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground/50">
                      <ImageIcon className="h-10 w-10 mb-2" />
                      <span className="text-sm">لم يتم تحديد صورة</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
              <Button 
                className="w-full sm:w-auto" 
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || isGenerating}
              >
                إضافة القسم
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            لا توجد فئات مضافة حتى الآن. ابدأ بإضافة فئتك الأولى!
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold w-[80px]">الصورة</TableHead>
                <TableHead className="font-bold">اسم القسم</TableHead>
                <TableHead className="font-bold">الرابط المعرف (Slug)</TableHead>
                <TableHead className="font-bold">عدد المنتجات</TableHead>
                <TableHead className="text-end font-bold">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="h-10 w-10 rounded-md object-cover border border-border" />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center border border-border">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-primary">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{category.slug}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {Math.floor(Math.random() * 20)} منتجات
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 me-1" /> حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
