import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jefixthwmqzhjrccrmvn.supabase.co';
const supabaseKey = 'sb_publishable_0WOUjHT0BDnz5ON1-jjjhg_M72Xwgj8';

export const supabase = createClient(supabaseUrl, supabaseKey);
