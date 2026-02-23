import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function createBucket() {
    console.log('Attempting to create session-audio bucket...');
    const { data, error } = await supabase.storage.createBucket('session-audio', {
        public: true,
        allowedMimeTypes: ['audio/*'],
    })

    if (error) {
        console.error('Bucket creation error:', error.message)
        // Check if API key needs service_role to create bucket
    } else {
        console.log('Bucket created successfully:', data)
    }
}

createBucket()
