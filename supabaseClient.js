import { createClient } from "@supabase/supabase-js";

// ════════════════════════════════════════════════════════════
//  ⚠️  ضع هنا معلومات مشروعك من Supabase
//  Put your Supabase project info here
//  (اتبع الشرح في ملف SETUP.md خطوة بخطوة)
// ════════════════════════════════════════════════════════════

const SUPABASE_URL = "https://qyrvfjesatztqhlrhhcm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_VA-fyTXrs1wu2vrbuQIdYg_-2pHtG8_";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
