import { createClient } from '@supabase/supabase-js';
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

(async function testPing() {
  const { data, error } = await supabase.auth.admin.listUsers({ limit: 1 });

  if (error) {
    console.error("❌ Connection failed:", error.message);
  } else {
    console.log("✅ Connected! to Supabase, no. of users:", data.users.length);
  }
})();