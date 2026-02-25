import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: check if env vars are loaded
console.log('Supabase URL loaded:', !!supabaseUrl)
console.log('Supabase Anon Key loaded:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        'Missing Supabase environment variables! Make sure .env file exists at the project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)