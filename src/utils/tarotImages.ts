const getWikimediaRedirect = (filename: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;

const majorArcanaMap: Record<string, string> = {
    "the_fool": "RWS_Tarot_00_Fool.jpg",
    "the_magician": "RWS_Tarot_01_Magician.jpg",
    "the_high_priestess": "RWS_Tarot_02_High_Priestess.jpg",
    "the_empress": "RWS_Tarot_03_Empress.jpg",
    "the_emperor": "RWS_Tarot_04_Emperor.jpg",
    "the_hierophant": "RWS_Tarot_05_Hierophant.jpg",
    "the_lovers": "RWS_Tarot_06_Lovers.jpg",
    "the_chariot": "RWS_Tarot_07_Chariot.jpg",
    "strength": "RWS_Tarot_08_Strength.jpg",
    "the_hermit": "RWS_Tarot_09_Hermit.jpg",
    "wheel_of_fortune": "RWS_Tarot_10_Wheel_of_Fortune.jpg",
    "justice": "RWS_Tarot_11_Justice.jpg",
    "the_hanged_man": "RWS_Tarot_12_Hanged_Man.jpg",
    "death": "RWS_Tarot_13_Death.jpg",
    "temperance": "RWS_Tarot_14_Temperance.jpg",
    "the_devil": "RWS_Tarot_15_Devil.jpg",
    "the_tower": "RWS_Tarot_16_Tower.jpg",
    "the_star": "RWS_Tarot_17_Star.jpg",
    "the_moon": "RWS_Tarot_18_Moon.jpg",
    "the_sun": "RWS_Tarot_19_Sun.jpg",
    "judgment": "RWS_Tarot_20_Judgement.jpg",
    "judgement": "RWS_Tarot_20_Judgement.jpg", // Handle spelling variant
    "the_world": "RWS_Tarot_21_World.jpg"
};

export const getTarotCardImage = (cardNameEn: string, suit?: string | null, number?: number | null): string => {
    if (!cardNameEn) return "";

    // Normalize name
    const normalizedName = cardNameEn.toLowerCase().replace(/ /g, '_');

    // 1. Check Major Arcana Map
    if (majorArcanaMap[normalizedName]) {
        return getWikimediaRedirect(majorArcanaMap[normalizedName]);
    }

    // 2. Handle Minor Arcana (Suit + Rank)
    // We need suit and rank. If not provided, try to parse from name.
    // E.g. "Ace of Wands" -> suit="Wands", rank=1
    // Wikimedia convention: {Suit}{01-14}.jpg (e.g. "Cups01.jpg", "Pents14.jpg")

    let targetSuit = suit;
    let targetRank = number;

    if (!targetSuit || !targetRank) {
        // Simple parsing logic if props are missing
        const parts = cardNameEn.toLowerCase().split(' of ');
        if (parts.length === 2) {
            const rankStr = parts[0];
            const suitStr = parts[1];

            // Map suit
            if (suitStr.includes('wand')) targetSuit = 'Wands';
            else if (suitStr.includes('cup')) targetSuit = 'Cups';
            else if (suitStr.includes('sword')) targetSuit = 'Swords';
            else if (suitStr.includes('pentacle')) targetSuit = 'Pents'; // Use 'Pents' for Wikimedia

            // Map rank
            const rankMap: Record<string, number> = {
                'ace': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
                'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
                'page': 11, 'knight': 12, 'queen': 13, 'king': 14
            };
            targetRank = rankMap[rankStr];
        }
    } else {
        // If suit is provided, normalize to Wikimedia format
        if (targetSuit.toLowerCase().includes('pentacle')) targetSuit = 'Pents';
        // Ensure others are capitalized: Wands, Cups, Swords
        targetSuit = targetSuit.charAt(0).toUpperCase() + targetSuit.slice(1).toLowerCase();
        if (targetSuit === 'Pentacles') targetSuit = 'Pents';
    }

    if (targetSuit && targetRank) {
        const paddedRank = targetRank.toString().padStart(2, '0');
        // Example: Wands01.jpg
        return getWikimediaRedirect(`${targetSuit}${paddedRank}.jpg`);
    }

    // Fallback?
    // Use a placeholder or return empty string to let component handle it
    console.warn(`Could not map card: ${cardNameEn} (Suit: ${targetSuit}, Rank: ${targetRank})`);
    return `https://placehold.co/300x500/000000/FFF?text=${encodeURIComponent(cardNameEn)}`;
};

export const getCardBackImage = (): string => {
    return "/images/tarot/card-back.png";
};
