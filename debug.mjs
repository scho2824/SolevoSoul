import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length > 0) {
        envVars[key.trim()] = vals.join('=').trim().replace(/"/g, '');
    }
});

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_KEY = envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

async function test() {
    console.log("Searching for client...");

    // Find "김똥꼬"
    const getRes = await fetch(`${SUPABASE_URL}/rest/v1/clients?nickname=eq.%EA%B9%80%EB%98%A5%EA%BC%AC`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });

    const clients = await getRes.json();
    if (!clients || clients.length === 0) {
        console.log("Client not found", clients);
        return;
    }

    const clientId = clients[0].id;
    console.log("Found client ID:", clientId);

    // Try to delete
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/clients?id=eq.${clientId}`, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=representation'
        }
    });

    const delText = await delRes.text();
    console.log("Delete status:", delRes.status);
    console.log("Delete response:", delText);
}

test().catch(console.error);
