import catBaby from "@/assets/cat-baby.jpg";
import catKids from "@/assets/cat-kids.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import catBedding from "@/assets/cat-bedding.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";
import p9 from "@/assets/p9.jpg";
import p10 from "@/assets/p10.jpg";
import p11 from "@/assets/p11.jpg";
import p12 from "@/assets/p12.jpg";
import p13 from "@/assets/p13.jpg";
import p14 from "@/assets/p14.jpg";

export type CategorySlug = "baby-clothes" | "kids-clothes" | "accessories" | "bedding";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
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
};

export const categories: Category[] = [
  {
    slug: "baby-clothes",
    name: "ملابس الرضع",
    description: "اكتشفوا تشكيلتنا المختارة من ملابس الرضع الناعمة والمريحة.",
    image: catBaby,
  },
  {
    slug: "kids-clothes",
    name: "ملابس الأطفال",
    description: "ملابس أنيقة وعملية للأطفال الصغار في كل المناسبات.",
    image: catKids,
  },
  {
    slug: "accessories",
    name: "الأكسسوارات",
    description: "قبعات، جوارب، أحذية وإكسسوارات صغيرة تكمل إطلالة طفلكم.",
    image: catAccessories,
  },
  {
    slug: "bedding",
    name: "أفرشة وأغطية",
    description: "أغطية، مفارش وتجهيزات نوم ناعمة لراحة طفلكم.",
    image: catBedding,
  },
];

export const babySizes = [
  "0-3 أشهر",
  "3-6 أشهر",
  "6-12 شهر",
  "12-18 شهر",
  "18-24 شهر",
];

export const kidsSizes = ["2 سنوات", "3 سنوات", "4 سنوات", "5 سنوات"];

export const products: Product[] = [
  {
    id: "1",
    slug: "newborn-gift-set",
    name: "طقم مواليد 5 قطع",
    category: "baby-clothes",
    price: 4200,
    oldPrice: 5300,
    images: [p1, p2],
    description:
      "طقم كامل للمواليد الجدد يتكوّن من بودي قطني، قبعة، قفازات وجوارب. قماش قطني ناعم 100% لطيف على بشرة الرضيع.",
    sizes: babySizes.slice(0, 3),
    colors: ["كريمي", "وردي"],
    inStock: true,
    isNew: true,
    bestSeller: true,
    createdAt: "2026-08-20",
  },
  {
    id: "2",
    slug: "baby-body-cotton",
    name: "بودي قطني للرضع",
    category: "baby-clothes",
    price: 1450,
    images: [p2, p1],
    description:
      "بودي قطني بأكمام قصيرة، مع أزرار سفلية عملية لتغيير سريع ومريح. متوفر بعدة ألوان هادئة.",
    sizes: babySizes,
    colors: ["وردي", "كريمي", "أزرق فاتح"],
    inStock: true,
    isNew: true,
    createdAt: "2026-08-18",
  },
  {
    id: "3",
    slug: "baby-pyjama-clouds",
    name: "بيجاما رضع بنقشة السحاب",
    category: "baby-clothes",
    price: 2600,
    oldPrice: 3100,
    images: [p3, p4],
    description:
      "بيجاما من قطعتين بقماش قطني مرن، مثالية لليل الهادئ. حواف مطاطية ناعمة لا تترك أثرًا على الجلد.",
    sizes: babySizes,
    colors: ["أزرق فاتح", "كريمي"],
    inStock: true,
    isNew: true,
    createdAt: "2026-08-17",
  },
  {
    id: "4",
    slug: "ensemble-bebe-tricot",
    name: "طقم رضع تريكو قطعتين",
    category: "baby-clothes",
    price: 3900,
    images: [p4, p1],
    description:
      "طقم تريكو ناعم يضم كارديغان وبنطالًا مطاطيًا. دفء خفيف بلمسة راقية للمناسبات والخروج اليومي.",
    sizes: babySizes,
    colors: ["بيج", "كريمي"],
    inStock: true,
    bestSeller: true,
    createdAt: "2026-08-12",
  },
  {
    id: "5",
    slug: "kids-dress-rose",
    name: "فستان أطفال وردي بكشكش",
    category: "kids-clothes",
    price: 3450,
    oldPrice: 4100,
    images: [p5, p6],
    description:
      "فستان قطني بلون وردي هادئ وأكمام كشكش، خفيف ومريح للحركة، مثالي للمناسبات والصور العائلية.",
    sizes: kidsSizes,
    colors: ["وردي"],
    inStock: true,
    isNew: true,
    createdAt: "2026-08-22",
  },
  {
    id: "6",
    slug: "kids-set-sweat-jogger",
    name: "طقم أطفال سويت شيرت وجوغر",
    category: "kids-clothes",
    price: 3800,
    images: [p6, p5],
    description:
      "طقم رياضي عصري من سويت شيرت أزرق فاتح وبنطال جوغر بيج. قماش سميك ناعم مناسب للفصول الباردة.",
    sizes: kidsSizes,
    colors: ["أزرق فاتح", "بيج"],
    inStock: true,
    bestSeller: true,
    createdAt: "2026-08-10",
  },
  {
    id: "7",
    slug: "baby-bonnet-knit",
    name: "قبعة تريكو للرضع",
    category: "accessories",
    price: 950,
    images: [p7, p8],
    description: "قبعة تريكو ناعمة بأذنين صغيرتين، تحفظ دفء رأس الرضيع دون ضغط.",
    sizes: ["0-6 أشهر", "6-12 شهر"],
    colors: ["كريمي"],
    inStock: true,
    isNew: true,
    createdAt: "2026-08-21",
  },
  {
    id: "8",
    slug: "baby-socks-pack",
    name: "جوارب رضع 3 أزواج",
    category: "accessories",
    price: 780,
    oldPrice: 990,
    images: [p8, p7],
    description: "ثلاثة أزواج من الجوارب القطنية بألوان هادئة، بحواف مرنة لا تضغط على القدم.",
    sizes: ["0-6 أشهر", "6-12 شهر", "1-2 سنة"],
    colors: ["وردي", "كريمي", "أزرق"],
    inStock: true,
    bestSeller: true,
    createdAt: "2026-08-08",
  },
  {
    id: "9",
    slug: "baby-shoes-bow",
    name: "حذاء أطفال بفيونكة",
    category: "accessories",
    price: 1900,
    images: [p9, p7],
    description: "حذاء ناعم بنعل مرن مناسب للخطوات الأولى، بتصميم أنيق بفيونكة صغيرة.",
    sizes: ["16", "17", "18", "19", "20"],
    colors: ["كريمي"],
    inStock: true,
    createdAt: "2026-08-05",
  },
  {
    id: "10",
    slug: "baby-blanket-knit",
    name: "بطانية تريكو للرضع",
    category: "bedding",
    price: 3200,
    oldPrice: 3900,
    images: [p10, p11],
    description: "بطانية تريكو وردية فاتحة، خفيفة ودافئة، مناسبة للسرير أو عربة الطفل.",
    sizes: ["مقاس واحد"],
    colors: ["وردي فاتح"],
    inStock: true,
    isNew: true,
    createdAt: "2026-08-19",
  },
  {
    id: "11",
    slug: "crib-sheet-set",
    name: "غطاء سرير أطفال بنجوم",
    category: "bedding",
    price: 2750,
    images: [p11, p10],
    description: "طقم مفارش لسرير الطفل بقماش قطني مطبوع بنجوم وردية هادئة، سهل الغسل.",
    sizes: ["60×120 سم", "70×140 سم"],
    colors: ["كريمي"],
    inStock: true,
    createdAt: "2026-08-02",
  },
  {
    id: "12",
    slug: "hooded-baby-towel",
    name: "منشفة أطفال بقبعة",
    category: "bedding",
    price: 1850,
    images: [p12, p10],
    description: "منشفة قطنية عالية الامتصاص بقبعة صغيرة، تلفّ الطفل بالدفء بعد الحمام.",
    sizes: ["مقاس واحد"],
    colors: ["كريمي/وردي"],
    inStock: true,
    createdAt: "2026-07-30",
  },
  {
    id: "13",
    slug: "baby-teddy-coat",
    name: "معطف رضع تيدي بقبعة",
    category: "baby-clothes",
    price: 5200,
    oldPrice: 6400,
    images: [p13, p4],
    description: "معطف من قماش التيدي الناعم بقبعة وأزرار خشبية، دفء عالٍ بمظهر راقٍ.",
    sizes: babySizes,
    colors: ["كريمي"],
    inStock: false,
    createdAt: "2026-07-28",
  },
  {
    id: "14",
    slug: "baby-bibs-pack",
    name: "مرايل رضع 3 قطع",
    category: "accessories",
    price: 890,
    images: [p14, p8],
    description: "ثلاث مرايل قطنية بألوان هادئة وأزرار تثبيت، عملية لوقت الطعام.",
    sizes: ["مقاس واحد"],
    colors: ["وردي", "كريمي", "أزرق"],
    inStock: true,
    createdAt: "2026-07-25",
  },
  {
    id: "15",
    slug: "kids-cotton-dress-daily",
    name: "فستان أطفال قطني يومي",
    category: "kids-clothes",
    price: 2900,
    images: [p5, p3],
    description: "فستان قطني خفيف للاستعمال اليومي، مريح للحركة وسهل الغسل.",
    sizes: kidsSizes,
    colors: ["وردي"],
    inStock: true,
    createdAt: "2026-07-20",
  },
  {
    id: "16",
    slug: "kids-shirt-set-elegant",
    name: "طقم قميص وبنطال للأطفال",
    category: "kids-clothes",
    price: 4300,
    oldPrice: 4900,
    images: [p6, p13],
    description: "قميص أزرق فاتح مع بنطال بيج، إطلالة أنيقة للمناسبات العائلية.",
    sizes: kidsSizes,
    colors: ["أزرق فاتح"],
    inStock: true,
    createdAt: "2026-07-15",
  },
  {
    id: "17",
    slug: "winter-warm-bundle",
    name: "باقة شتاء دافئ",
    category: "accessories",
    price: 4500,
    oldPrice: 5300,
    images: [p7, p10],
    description:
      "باقة مثالية للشتاء: قبعة تريكو ناعمة + بطانية تريكو دافئة + 3 أزواج جوارب قطنية. كل ما يحتاجه طفلكم للدفء بسعر مميز.",
    sizes: ["0-12 شهر"],
    colors: ["كريمي / وردي"],
    inStock: true,
    isNew: true,
    bestSeller: true,
    createdAt: "2026-08-25",
    bundleItems: ["قبعة تريكو للرضع", "بطانية تريكو للرضع", "جوارب رضع 3 أزواج"],
  },
  {
    id: "18",
    slug: "elegant-outing-bundle",
    name: "باقة خروج أنيقة",
    category: "kids-clothes",
    price: 4900,
    oldPrice: 5950,
    images: [p5, p9],
    description:
      "إطلالة كاملة للخروج: فستان أطفال وردي بكشكش + حذاء ناعم بفيونكة. باقة هدية جاهزة للمناسبات العائلية.",
    sizes: ["2-5 سنوات"],
    colors: ["وردي / كريمي"],
    inStock: true,
    isNew: true,
    createdAt: "2026-08-24",
    bundleItems: ["فستان أطفال وردي بكشكش", "حذاء أطفال بفيونكة"],
  },
  {
    id: "19",
    slug: "newborn-gift-bundle",
    name: "باقة هدايا المولود",
    category: "baby-clothes",
    price: 6500,
    oldPrice: 7800,
    images: [p1, p12],
    description:
      "أفضل هدية للمولود الجديد: طقم مواليد 5 قطع + منشفة بقبعة + 3 مرايل قطنية. تجهيز كامل بسعر الباقة.",
    sizes: ["0-6 أشهر"],
    colors: ["كريمي / وردي / أزرق"],
    inStock: true,
    isNew: true,
    createdAt: "2026-08-23",
    bundleItems: ["طقم مواليد 5 قطع", "منشفة أطفال بقبعة", "مرايل رضع 3 قطع"],
  },
];

export const WILAYAS = [
  "أدرار",
  "الشلف",
  "الأغواط",
  "أم البواقي",
  "باتنة",
  "بجاية",
  "بسكرة",
  "بشار",
  "البليدة",
  "البويرة",
  "تمنراست",
  "تبسة",
  "تلمسان",
  "تيارت",
  "تيزي وزو",
  "الجزائر",
  "الجلفة",
  "جيجل",
  "سطيف",
  "سعيدة",
  "سكيكدة",
  "سيدي بلعباس",
  "عنابة",
  "قالمة",
  "قسنطينة",
  "المدية",
  "مستغانم",
  "المسيلة",
  "معسكر",
  "ورقلة",
  "وهران",
  "البيض",
  "إليزي",
  "برج بوعريريج",
  "بومرداس",
  "الطارف",
  "تندوف",
  "تيسمسيلت",
  "الوادي",
  "خنشلة",
  "سوق أهراس",
  "تيبازة",
  "ميلة",
  "عين الدفلى",
  "النعامة",
  "عين تموشنت",
  "غرداية",
  "غليزان",
];

export const SHIPPING_COST = 600;

export function formatPrice(value: number) {
  return `${value.toLocaleString("fr-FR").replace(/\u202f|,/g, " ")} دج`;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function categoryName(slug: CategorySlug) {
  return getCategory(slug)?.name ?? "";
}

export function discountPercent(product: Product) {
  if (!product.oldPrice) return null;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}
