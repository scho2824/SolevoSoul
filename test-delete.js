require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testDelete() {
    // Assuming 'id' is a known UUID from the screenshot, but let's just query a client and try to delete it, 
    // Wait, the anon key uses RLS, so we need to log in first, or just use the SERVICE_ROLE_KEY if available.
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
        console.log("Using service role key");
        
        // Let's get "김똥꼬" client
        const { data: client, error: getErr } = await adminClient.from('clients').select('id, nickname').eq('nickname', '김똥꼬').single();
        if (getErr) { console.error("Get error:", getErr); return; }
        console.log("Found client:", client);

        const { error: delErr } = await adminClient.from('clients').delete().eq('id', client.id);
        console.log("Delete error:", delErr);
    } else {
        console.log("No service role key available in .env.local to bypass RLS for debugging.");
    }
}
testDelete();
