import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Strip trailing slash — Supabase client builds its own paths and a trailing
// slash produces double-slash URLs (e.g. .../rest/v1//table) which 404.
const supabaseUrl = rawUrl ? rawUrl.replace(/\/$/, '') : ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Laurelle Realty] Supabase env vars not set. ' +
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
