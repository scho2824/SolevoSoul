import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface TarotCard {
    id: string;
    name_en: string;
    name_kr: string;
    suit: string | null;
    number: number;
    arcana_type: 'major' | 'minor';
    image_url: string | null;
    keywords: string[];
    description_upright: string;
    description_reversed: string;
}

export interface DrawnCard extends TarotCard {
    position_index: number;
    position_meaning: string;
    is_reversed: boolean;
}

export type SpreadType = '1-card' | '3-card' | 'celtic-cross';

const SPREAD_CONFIGS = {
    '1-card': {
        count: 1,
        positions: ['Present Situation']
    },
    '3-card': {
        count: 3,
        positions: ['Past', 'Present', 'Future']
    },
    'celtic-cross': {
        count: 10,
        positions: [
            'Present',
            'Challenge',
            'Past',
            'Future',
            'Above',
            'Below',
            'Advice',
            'External Influences',
            'Hopes/Fears',
            'Outcome'
        ]
    }
};

/**
 * Fisher-Yates Shuffle Algorithm
 * Ensures true randomness with O(n) complexity
 */
function fisherYatesShuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function useTarotDeck() {
    const [deck, setDeck] = useState<TarotCard[]>([]);
    const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    /**
     * Load the full 78-card deck from Supabase
     */
    const loadDeck = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('tarot_deck_data')
            .select('*')
            .order('arcana_type', { ascending: false }) // Major first
            .order('number', { ascending: true });

        if (error) {
            console.error('Error loading tarot deck:', error);
            setIsLoading(false);
            return;
        }

        setDeck(data as TarotCard[]);
        setIsLoading(false);
    }, [supabase]);

    /**
     * Shuffle the deck using Fisher-Yates algorithm
     */
    const shuffle = useCallback(() => {
        if (deck.length === 0) return;

        setIsShuffling(true);

        // Simulate shuffling animation delay
        setTimeout(() => {
            const shuffled = fisherYatesShuffle(deck);
            setDeck(shuffled);
            setIsShuffling(false);
        }, 1500);
    }, [deck]);

    /**
     * Draw cards for a specific spread
     */
    const draw = useCallback((spreadType: SpreadType) => {
        if (deck.length === 0) {
            console.warn('Deck not loaded. Call loadDeck() first.');
            return;
        }

        const config = SPREAD_CONFIGS[spreadType];
        const drawn: DrawnCard[] = [];

        for (let i = 0; i < config.count; i++) {
            const card = deck[i];
            const isReversed = Math.random() > 0.5; // 50% chance of reversal

            drawn.push({
                ...card,
                position_index: i,
                position_meaning: config.positions[i],
                is_reversed: isReversed
            });
        }

        setDrawnCards(drawn);
        return drawn;
    }, [deck]);

    /**
     * Reset the deck and drawn cards
     */
    const reset = useCallback(() => {
        setDrawnCards([]);
        loadDeck(); // Reload fresh deck
    }, [loadDeck]);

    /**
     * Save drawn cards to a session
     */
    const saveToSession = useCallback(async (sessionId: string) => {
        if (drawnCards.length === 0) {
            console.warn('No cards drawn to save.');
            return;
        }

        const cardsToInsert = drawnCards.map(card => ({
            session_id: sessionId,
            card_id: card.id,
            position_index: card.position_index,
            position_meaning: card.position_meaning,
            is_reversed: card.is_reversed
        }));

        const { error } = await supabase
            .from('session_cards')
            .insert(cardsToInsert);

        if (error) {
            console.error('Error saving cards to session:', error);
            throw error;
        }

        return cardsToInsert;
    }, [drawnCards, supabase]);

    return {
        deck,
        drawnCards,
        isShuffling,
        isLoading,
        loadDeck,
        shuffle,
        draw,
        reset,
        saveToSession
    };
}
