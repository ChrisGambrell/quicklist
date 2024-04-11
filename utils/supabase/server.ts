import { Database } from '@/db_types'
import { createClient as _createClient } from '@supabase/supabase-js'

// TODO: Needs to be server client
export const createClient = () => _createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
