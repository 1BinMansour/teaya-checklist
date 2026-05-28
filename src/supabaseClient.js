import { createClient } from "@supabase/supabase-js";

// ════════════════════════════════════════════════════════════
//  ⚠️  ضع هنا معلومات مشروعك من Supabase
//  Put your Supabase project info here
//  (اتبع الشرح في ملف SETUP.md خطوة بخطوة)
// ════════════════════════════════════════════════════════════

const SUPABASE_URL = "https://qyrvfjesatztqhlrhhcm.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cnZmamVzYXR6dHFobHJoaGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTUyNzYsImV4cCI6MjA5NTU3MTI3Nn0.VP_fTU9lXODgTe4i7AsQDdGSZhbJHQi0o8P_mlzTMmg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
