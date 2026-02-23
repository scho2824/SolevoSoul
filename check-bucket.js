import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uhvjspopzfmntjufxndu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodmpzcG9wemZtbnRqdWZ4bmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODE3MTEsImV4cCI6MjA4NTY1NzcxMX0.V_dhQogEQIEqvXJRbc_apVQmSPmCFkZVwfK-i8qpYiE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkBucket() {
    const { data, error } = await supabase.storage.getBucket('session-audio')
    if (error) {
        console.error('Bucket error:', error.message)
    } else {
        console.log('Bucket exists:', data)
    }
}

checkBucket()
