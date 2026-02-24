require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testDelete() {
    console.log("Searching for client '김똥꼬'...");
    const { data: clients, error: searchErr } = await supabase
        .from('clients')
        .select('id, nickname')
        .eq('nickname', '김똥꼬');

    if (searchErr) {
        console.error("Search Error:", searchErr);
        return;
    }

    if (!clients || clients.length === 0) {
        console.log("Client not found.");
        return;
    }

    const clientId = clients[0].id;
    console.log(`Attempting to delete client: ${clients[0].nickname} (${clientId})`);

    const { error: delErr } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

    if (delErr) {
        console.error("🔥 Deletion Error:", JSON.stringify(delErr, null, 2));
    } else {
        console.log("✅ Deletion successful using anon key. The UI should have worked.");
    }
}

testDelete();
