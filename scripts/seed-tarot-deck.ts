import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedTarotDeck() {
    console.log('🔮 Starting Universal Waite Tarot Deck seeding...')

    // Load all card data files
    const majorArcana = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data/tarot-major-arcana.json'), 'utf-8')
    )
    const wands = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data/tarot-wands.json'), 'utf-8')
    )
    const cups = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data/tarot-cups.json'), 'utf-8')
    )
    const swords = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data/tarot-swords.json'), 'utf-8')
    )
    const pentacles = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'data/tarot-pentacles.json'), 'utf-8')
    )

    // Combine all cards
    const allCards = [...majorArcana, ...wands, ...cups, ...swords, ...pentacles]

    console.log(`📊 Total cards to insert: ${allCards.length}`)

    // Check if data already exists
    const { count } = await supabase
        .from('tarot_deck_data')
        .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
        console.log(`⚠️  Database already contains ${count} cards. Skipping seed.`)
        console.log('   To re-seed, manually delete records from tarot_deck_data table.')
        return
    }

    // Insert cards
    const { data, error } = await supabase
        .from('tarot_deck_data')
        .insert(allCards)
        .select()

    if (error) {
        console.error('❌ Error seeding tarot deck:', error)
        process.exit(1)
    }

    console.log(`✅ Successfully seeded ${data?.length} cards!`)
    console.log('🎴 Universal Waite Tarot Deck is ready.')
}

seedTarotDeck()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Fatal error:', err)
        process.exit(1)
    })
