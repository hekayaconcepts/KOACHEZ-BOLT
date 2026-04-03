import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tgwiinzsjowdysqdorjh.supabase.co'
const supabaseKey = 'sb_publishable_Vnm3tRiW1J-Fy28eAx3MlA_eh7WEPbF'

export const supabase = createClient(supabaseUrl, supabaseKey)
