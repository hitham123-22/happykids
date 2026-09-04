import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ssvpbjmxyuatpgwokfir.supabase.co'
const supabaseAnonKey = 'sb_publishable_FELRTavXKg9_pnTksCzD4w__5czdsJJ'

const isServer = typeof window === 'undefined'

if (isServer && !globalThis.WebSocket) {
  // Prevent RealtimeClient crash in Node 20 by providing a dummy WebSocket
  globalThis.WebSocket = class DummyWebSocket {} as any
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: !isServer,
  },
})
