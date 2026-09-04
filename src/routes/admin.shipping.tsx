import { useState, useMemo, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import allWilayas from "@/data/wilayas.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Truck, Search, Info, Upload, Loader2, Wand2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/shipping")({
  component: AdminShipping,
});

const ALGERIAN_WILAYAS = allWilayas.map(w => ({
  wilaya_id: w.code,
  wilaya_name: w.name_ar,
  home_price: 800,
  desk_price: 500
}));

function AdminShipping() {
  const queryClient = useQueryClient();
  const [wilayas, setWilayas] = useState<any[]>([]);
  
  const { data: dbShipping = [], isLoading } = useQuery({
    queryKey: ["shipping_rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_rates")
        .select("*")
        .order("wilaya_id", { ascending: true });
        
      if (error) {
        toast.error("فشل في جلب أسعار التوصيل");
        throw error;
      }
      return data;
    }
  });

  // Sync DB data to local state for editing
  useEffect(() => {
    if (!isLoading) {
      // Merge all 69 wilayas with any existing DB rates
      const merged = ALGERIAN_WILAYAS.map(w => {
        const dbRate = dbShipping.find((db: any) => db.wilaya_id === w.wilaya_id);
        if (dbRate) return dbRate;
        return w;
      });
      setWilayas(merged);
    }
  }, [dbShipping, isLoading]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("shipping_rates")
        .upsert(wilayas, { onConflict: "wilaya_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping_rates"] });
      toast.success("تم حفظ أسعار التوصيل بنجاح");
    },
    onError: (error) => {
      console.error(error);
      toast.error("حدث خطأ أثناء حفظ الأسعار");
    }
  });

  const updatePrice = (id: number, field: "home_price" | "desk_price", value: string) => {
    const numValue = parseInt(value) || 0;
    setWilayas(wilayas.map(w => w.wilaya_id === id ? { ...w, [field]: numValue } : w));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsAnalyzing(true);
      // Simulate AI processing of the price list image
      setTimeout(() => {
        setWilayas(prev => prev.map(w => {
          // Simulate extracted prices: randomize slightly for demo
          const randomHome = Math.floor(Math.random() * (15 - 5 + 1) + 5) * 100;
          const randomDesk = randomHome - 300;
          return {
            ...w,
            home_price: randomHome,
            desk_price: Math.max(200, randomDesk)
          };
        }));
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  const filteredWilayas = useMemo(() => {
    return wilayas.filter((w) => {
      const searchStr = searchQuery.toLowerCase();
      return (
        w.wilaya_name.toLowerCase().includes(searchStr) ||
        w.wilaya_id.toString().includes(searchStr)
      );
    });
  }, [wilayas, searchQuery]);

  return (
    <div className="flex h-screen w-full flex-col bg-muted/10">
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-2 items-center">
              <Button 
                onClick={() => saveMutation.mutate()} 
                disabled={saveMutation.isPending || isLoading}
                className="bg-red-950/40 text-red-500 hover:bg-red-900/50 hover:text-red-400 border border-red-900/50 shadow-sm transition-all px-6 py-6 h-auto text-base font-semibold rounded-xl"
              >
                {saveMutation.isPending ? <Loader2 className="ml-2 h-5 w-5 animate-spin" /> : <Save className="ml-2 h-5 w-5" />}
                حفظ جميع التغييرات
              </Button>
              <Button 
                variant="outline" 
                className="border-red-900/30 text-red-500 hover:bg-red-950/20 px-6 py-6 h-auto text-base font-semibold rounded-xl relative overflow-hidden group"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <><Loader2 className="ml-2 h-5 w-5 animate-spin" /> جاري تحليل الصورة...</>
                ) : (
                  <><Wand2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" /> استخراج من ورقة الأسعار</>
                )}
                {isAnalyzing && <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>}
              </Button>
              <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
            </div>

            <div className="flex items-center gap-4 text-right justify-end">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">أسعار التوصيل</h2>
                <p className="text-muted-foreground mt-1 text-sm">تعديل أسعار التوصيل لجميع الولايات (للمنزل وللمكتب)</p>
              </div>
              <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-red-950/30 text-red-500 border border-red-900/30 shadow-inner">
                <Truck className="h-7 w-7" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl text-card-foreground shadow-2xl overflow-hidden p-6 relative">
            
            {isAnalyzing && (
              <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="bg-card border border-red-900/30 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm text-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div>
                    <div className="relative bg-red-950/50 p-4 rounded-full border border-red-900/50">
                      <Wand2 className="h-8 w-8 text-red-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-red-500">الذكاء الاصطناعي يعمل...</h3>
                  <p className="text-sm text-muted-foreground">جاري قراءة الورقة واستخراج أسعار التوصيل للمنزل وللمكتب لجميع الولايات تلقائياً...</p>
                </div>
              </div>
            )}

            {/* Info Banner */}
            <div className="flex items-center justify-end gap-3 rounded-xl border border-red-900/30 bg-red-950/20 px-6 py-4 mb-6 text-sm text-red-200">
              <span>قم بتحديد التسعيرة لمختلف الولايات. الأسعار محفوظة محلياً وتُطَبَّق فوراً في صفحة الدفع.</span>
              <Info className="h-5 w-5 text-red-500" />
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="ابحث عن ولاية بالاسم أو الرقم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-12 py-6 bg-background/50 border-border/50 text-right rounded-xl focus-visible:ring-red-500/50"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50 hover:bg-transparent">
                    <TableHead className="font-semibold text-muted-foreground w-[80px] text-center pb-4 text-sm">الرقم</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-center pb-4 text-sm">الولاية</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-center pb-4 text-sm">Stopdesk (DA)</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-center pb-4 text-sm">Domicile (DA)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      </TableCell>
                    </TableRow>
                  ) : filteredWilayas.map((wilaya) => (
                    <TableRow key={wilaya.wilaya_id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                      <TableCell className="font-medium text-muted-foreground text-center py-5 font-mono" dir="ltr" lang="en">
                        {wilaya.wilaya_id.toString().padStart(2, '0')}
                      </TableCell>
                      <TableCell className="font-bold text-center py-5 text-base">
                        {wilaya.wilaya_name}
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex justify-center">
                          <Input 
                            type="number" 
                            dir="ltr"
                            lang="en"
                            value={wilaya.desk_price || ""} 
                            onChange={(e) => updatePrice(wilaya.wilaya_id, "desk_price", e.target.value)}
                            className="w-32 text-center font-bold font-mono text-lg tabular-nums bg-background/40 border-border/50 focus-visible:ring-red-500/50 rounded-lg h-10 tracking-widest"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex justify-center">
                          <Input 
                            type="number"
                            dir="ltr"
                            lang="en" 
                            value={wilaya.home_price || ""} 
                            onChange={(e) => updatePrice(wilaya.wilaya_id, "home_price", e.target.value)}
                            className="w-32 text-center font-bold font-mono text-lg tabular-nums bg-background/40 border-border/50 focus-visible:ring-red-500/50 rounded-lg h-10 tracking-widest"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredWilayas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                        لم يتم العثور على أية نتائج بحث.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
