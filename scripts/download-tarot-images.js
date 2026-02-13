/**
 * Download all 78 Rider-Waite tarot card images from sacred-texts.com
 * and organize them into local folders for Supabase Storage upload
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Create output directory structure
const OUTPUT_DIR = path.join(__dirname, '../public/tarot-cards');
const MAJOR_DIR = path.join(OUTPUT_DIR, 'major');
const WANDS_DIR = path.join(OUTPUT_DIR, 'wands');
const CUPS_DIR = path.join(OUTPUT_DIR, 'cups');
const SWORDS_DIR = path.join(OUTPUT_DIR, 'swords');
const PENTACLES_DIR = path.join(OUTPUT_DIR, 'pentacles');

// Create directories
[OUTPUT_DIR, MAJOR_DIR, WANDS_DIR, CUPS_DIR, SWORDS_DIR, PENTACLES_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Image URL mappings
const imageUrls = {
    major: [
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar00.jpg', name: '00-fool.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar01.jpg', name: '01-magician.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar02.jpg', name: '02-high-priestess.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar03.jpg', name: '03-empress.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar04.jpg', name: '04-emperor.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar05.jpg', name: '05-hierophant.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar06.jpg', name: '06-lovers.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar07.jpg', name: '07-chariot.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar08.jpg', name: '08-strength.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar09.jpg', name: '09-hermit.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar10.jpg', name: '10-wheel-of-fortune.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar11.jpg', name: '11-justice.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar12.jpg', name: '12-hanged-man.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar13.jpg', name: '13-death.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar14.jpg', name: '14-temperance.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar15.jpg', name: '15-devil.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar16.jpg', name: '16-tower.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar17.jpg', name: '17-star.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar18.jpg', name: '18-moon.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar19.jpg', name: '19-sun.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar20.jpg', name: '20-judgement.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/ar21.jpg', name: '21-world.jpg' },
    ],
    wands: [
        { url: 'https://sacred-texts.com/tarot/pkt/img/waac.jpg', name: 'ace.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wa02.jpg', name: '02.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wa03.jpg', name: '03.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wa04.jpg', name: '04.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wa05.jpg', name: '05.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wa06.jpg', name: '06.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wa07.jpg', name: '07.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wa08.jpg', name: '08.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wa09.jpg', name: '09.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wa10.jpg', name: '10.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wapa.jpg', name: 'page.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/wakn.jpg', name: 'knight.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/waqu.jpg', name: 'queen.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/waki.jpg', name: 'king.jpg' },
    ],
    cups: [
        { url: 'https://sacred-texts.com/tarot/pkt/img/cuac.jpg', name: 'ace.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cu02.jpg', name: '02.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cu03.jpg', name: '03.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cu04.jpg', name: '04.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cu05.jpg', name: '05.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cu06.jpg', name: '06.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cu07.jpg', name: '07.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cu08.jpg', name: '08.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cu09.jpg', name: '09.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cu10.jpg', name: '10.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cupa.jpg', name: 'page.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cukn.jpg', name: 'knight.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cuqu.jpg', name: 'queen.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/cuki.jpg', name: 'king.jpg' },
    ],
    swords: [
        { url: 'https://sacred-texts.com/tarot/pkt/img/swac.jpg', name: 'ace.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/sw02.jpg', name: '02.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/sw03.jpg', name: '03.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/sw04.jpg', name: '04.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/sw05.jpg', name: '05.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/sw06.jpg', name: '06.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/sw07.jpg', name: '07.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/sw08.jpg', name: '08.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/sw09.jpg', name: '09.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/sw10.jpg', name: '10.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/swpa.jpg', name: 'page.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/swkn.jpg', name: 'knight.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/swqu.jpg', name: 'queen.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/swki.jpg', name: 'king.jpg' },
    ],
    pentacles: [
        { url: 'https://sacred-texts.com/tarot/pkt/img/peac.jpg', name: 'ace.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pe02.jpg', name: '02.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pe03.jpg', name: '03.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pe04.jpg', name: '04.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pe05.jpg', name: '05.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pe06.jpg', name: '06.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pe07.jpg', name: '07.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pe08.jpg', name: '08.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pe09.jpg', name: '09.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pe10.jpg', name: '10.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pepa.jpg', name: 'page.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pekn.jpg', name: 'knight.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/pequ.jpg', name: 'queen.jpg' },
        { url: 'https://sacred-texts.com/tarot/pkt/img/peki.jpg', name: 'king.jpg' },
    ],
};

// Download function
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(filepath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`✓ Downloaded: ${path.basename(filepath)}`);
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(filepath, () => { });
                reject(err);
            });
        }).on('error', reject);
    });
}

// Main download function
async function downloadAllImages() {
    console.log('🎴 Starting tarot card image download...\n');

    let totalDownloaded = 0;
    let totalFailed = 0;

    for (const [suit, images] of Object.entries(imageUrls)) {
        console.log(`\n📂 Downloading ${suit.toUpperCase()}...`);

        const targetDir = suit === 'major' ? MAJOR_DIR :
            suit === 'wands' ? WANDS_DIR :
                suit === 'cups' ? CUPS_DIR :
                    suit === 'swords' ? SWORDS_DIR :
                        PENTACLES_DIR;

        for (const { url, name } of images) {
            const filepath = path.join(targetDir, name);

            try {
                await downloadImage(url, filepath);
                totalDownloaded++;
            } catch (error) {
                console.error(`✗ Failed: ${name} - ${error.message}`);
                totalFailed++;
            }
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Download complete!`);
    console.log(`   Total downloaded: ${totalDownloaded}/78`);
    if (totalFailed > 0) {
        console.log(`   Failed: ${totalFailed}`);
    }
    console.log(`   Output directory: ${OUTPUT_DIR}`);
    console.log('='.repeat(50));
    console.log('\n📋 Next steps:');
    console.log('1. Go to Supabase Dashboard → Storage');
    console.log('2. Create a new bucket named "tarot-cards"');
    console.log('3. Upload the folders from public/tarot-cards/');
    console.log('4. Run the SQL migration to update image URLs');
}

// Run the download
downloadAllImages().catch(console.error);
