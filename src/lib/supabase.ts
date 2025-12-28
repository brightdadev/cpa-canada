import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'
import { Config } from '../config' // <--- Clean Import

if (!Config.Supabase.Url || !Config.Supabase.AnonKey) {
    throw new Error('Supabase Configuration Missing. Check src/config.ts')
}

export const supabase = createClient<Database>(Config.Supabase.Url, Config.Supabase.AnonKey)
