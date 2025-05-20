import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ekzpkmlrsihinxwnhzyd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrenBrbWxyc2loaW54d25oenlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzY5MzgsImV4cCI6MjA2MzM1MjkzOH0.ZaAGvJjqxBAGJ_SsPBGsQZxhivardWdvZXzNMVm-FkY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
