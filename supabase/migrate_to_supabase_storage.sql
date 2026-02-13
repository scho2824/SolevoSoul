-- Migration script to update tarot card image URLs to Supabase Storage
-- Run this AFTER uploading images to Supabase Storage

-- Step 1: Create storage bucket (if not exists)
-- This should be done via Supabase Dashboard or using the storage API

-- Step 2: Update image URLs to point to Supabase Storage
-- Replace [YOUR_PROJECT_REF] with your actual Supabase project reference
-- Example: uhvjspopzfmntjufxndu

-- Major Arcana
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/00-fool.jpg' WHERE name_en = 'The Fool';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/01-magician.jpg' WHERE name_en = 'The Magician';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/02-high-priestess.jpg' WHERE name_en = 'The High Priestess';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/03-empress.jpg' WHERE name_en = 'The Empress';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/04-emperor.jpg' WHERE name_en = 'The Emperor';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/05-hierophant.jpg' WHERE name_en = 'The Hierophant';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/06-lovers.jpg' WHERE name_en = 'The Lovers';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/07-chariot.jpg' WHERE name_en = 'The Chariot';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/08-strength.jpg' WHERE name_en = 'Strength';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/09-hermit.jpg' WHERE name_en = 'The Hermit';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/10-wheel-of-fortune.jpg' WHERE name_en = 'Wheel of Fortune';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/11-justice.jpg' WHERE name_en = 'Justice';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/12-hanged-man.jpg' WHERE name_en = 'The Hanged Man';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/13-death.jpg' WHERE name_en = 'Death';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/14-temperance.jpg' WHERE name_en = 'Temperance';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/15-devil.jpg' WHERE name_en = 'The Devil';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/16-tower.jpg' WHERE name_en = 'The Tower';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/17-star.jpg' WHERE name_en = 'The Star';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/18-moon.jpg' WHERE name_en = 'The Moon';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/19-sun.jpg' WHERE name_en = 'The Sun';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/20-judgement.jpg' WHERE name_en = 'Judgement';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/major/21-world.jpg' WHERE name_en = 'The World';

-- Wands
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/ace.jpg' WHERE name_en = 'Ace of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/02.jpg' WHERE name_en = 'Two of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/03.jpg' WHERE name_en = 'Three of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/04.jpg' WHERE name_en = 'Four of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/05.jpg' WHERE name_en = 'Five of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/06.jpg' WHERE name_en = 'Six of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/07.jpg' WHERE name_en = 'Seven of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/08.jpg' WHERE name_en = 'Eight of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/09.jpg' WHERE name_en = 'Nine of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/10.jpg' WHERE name_en = 'Ten of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/page.jpg' WHERE name_en = 'Page of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/knight.jpg' WHERE name_en = 'Knight of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/queen.jpg' WHERE name_en = 'Queen of Wands';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/wands/king.jpg' WHERE name_en = 'King of Wands';

-- Cups
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/ace.jpg' WHERE name_en = 'Ace of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/02.jpg' WHERE name_en = 'Two of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/03.jpg' WHERE name_en = 'Three of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/04.jpg' WHERE name_en = 'Four of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/05.jpg' WHERE name_en = 'Five of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/06.jpg' WHERE name_en = 'Six of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/07.jpg' WHERE name_en = 'Seven of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/08.jpg' WHERE name_en = 'Eight of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/09.jpg' WHERE name_en = 'Nine of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/10.jpg' WHERE name_en = 'Ten of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/page.jpg' WHERE name_en = 'Page of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/knight.jpg' WHERE name_en = 'Knight of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/queen.jpg' WHERE name_en = 'Queen of Cups';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/cups/king.jpg' WHERE name_en = 'King of Cups';

-- Swords
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/ace.jpg' WHERE name_en = 'Ace of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/02.jpg' WHERE name_en = 'Two of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/03.jpg' WHERE name_en = 'Three of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/04.jpg' WHERE name_en = 'Four of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/05.jpg' WHERE name_en = 'Five of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/06.jpg' WHERE name_en = 'Six of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/07.jpg' WHERE name_en = 'Seven of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/08.jpg' WHERE name_en = 'Eight of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/09.jpg' WHERE name_en = 'Nine of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/10.jpg' WHERE name_en = 'Ten of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/page.jpg' WHERE name_en = 'Page of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/knight.jpg' WHERE name_en = 'Knight of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/queen.jpg' WHERE name_en = 'Queen of Swords';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/swords/king.jpg' WHERE name_en = 'King of Swords';

-- Pentacles
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/ace.jpg' WHERE name_en = 'Ace of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/02.jpg' WHERE name_en = 'Two of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/03.jpg' WHERE name_en = 'Three of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/04.jpg' WHERE name_en = 'Four of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/05.jpg' WHERE name_en = 'Five of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/06.jpg' WHERE name_en = 'Six of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/07.jpg' WHERE name_en = 'Seven of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/08.jpg' WHERE name_en = 'Eight of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/09.jpg' WHERE name_en = 'Nine of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/10.jpg' WHERE name_en = 'Ten of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/page.jpg' WHERE name_en = 'Page of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/knight.jpg' WHERE name_en = 'Knight of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/queen.jpg' WHERE name_en = 'Queen of Pentacles';
UPDATE tarot_deck_data SET image_url = 'https://uhvjspopzfmntjufxndu.supabase.co/storage/v1/object/public/tarot-cards/pentacles/king.jpg' WHERE name_en = 'King of Pentacles';

-- Verify all cards have images
SELECT COUNT(*) as total_cards, COUNT(image_url) as cards_with_images 
FROM tarot_deck_data;

-- Show sample of updated URLs
SELECT name_en, image_url 
FROM tarot_deck_data 
LIMIT 5;
