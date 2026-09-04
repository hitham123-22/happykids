import { createClient } from '@supabase/supabase-js';

globalThis.WebSocket = class DummyWebSocket {};

const supabaseUrl = 'https://ssvpbjmxyuatpgwokfir.supabase.co';
const supabaseAnonKey = 'sb_publishable_FELRTavXKg9_pnTksCzD4w__5czdsJJ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const categories = [
  {
    slug: "baby-clothes",
    name: "ملابس الرضع",
    image_url: "/src/assets/cat-baby.jpg"
  },
  {
    slug: "kids-clothes",
    name: "ملابس الأطفال",
    image_url: "/src/assets/cat-kids.jpg"
  },
  {
    slug: "accessories",
    name: "الأكسسوارات",
    image_url: "/src/assets/cat-accessories.jpg"
  },
  {
    slug: "bedding",
    name: "أفرشة وأغطية",
    image_url: "/src/assets/cat-bedding.jpg"
  }
];

async function insertCategories() {
  for (const cat of categories) {
    // Check if it exists
    const { data: existing } = await supabase.from('categories').select('*').eq('slug', cat.slug).single();
    if (!existing) {
      console.log('Inserting', cat.name);
      const { error } = await supabase.from('categories').insert(cat);
      if (error) console.error('Error inserting', cat.name, error);
    } else {
      console.log('Already exists', cat.name);
    }
  }
}

insertCategories();
