import { createClient } from '@supabase/supabase-js'
    
const supabaseUrl = 'https://qmoyyxzmsynasxwmlbhx.supabase.co'
const supabaseKey = 'sb_secret_hKFj9plUF32NKsfdyZROiQ_yUghMsHy'

export const supabase = createClient(supabaseUrl, supabaseKey)