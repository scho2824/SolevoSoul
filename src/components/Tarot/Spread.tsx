// ... imports ...
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

// Mock Data for demonstration if real data isn't passed
const MOCK_CARDS = [
    { id: 1, name: "The Fool", position: "Past", image: "/tarot/fool.jpg", desc: "새로운 시작, 순수함" },
    { id: 2, name: "The Magician", position: "Present", image: "/tarot/magician.jpg", desc: "창조력, 의지" },
    { id: 3, name: "The High Priestess", position: "Future", image: "/tarot/priestess.jpg", desc: "직관, 무의식" }
];

interface Card {
    id: number;
    name: string;
    position: string;
    image: string;
    desc: string;
}

interface SpreadProps {
    cards: Card[];
    isRevealed: boolean;
}

export default function TarotSpread({ cards = [], isRevealed }: SpreadProps) {
    const displayCards = cards.length > 0 ? cards : MOCK_CARDS;
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto px-4">
                {displayCards.map((card: Card, index: number) => (
                    <motion.div
                        key={card.id || index}
                        initial={{ opacity: 0, y: 20, rotateY: 180 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            rotateY: isRevealed ? 0 : 180
                        }}
                        transition={{
                            delay: index * 0.2,
                            duration: 0.8,
                            type: "spring"
                        }}
                        className="aspect-[2/3] relative perspective-1000 cursor-pointer group"
                        onClick={() => isRevealed && setSelectedCard(card)}
                    >
                        {/* Hover Effect Hint */}
                        {isRevealed && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[var(--color-soft-gold)] text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                🔍 터치하여 확대
                            </div>
                        )}

                        {/* Card Container with Flip Logic */}
                        <div className="relative w-full h-full text-center transition-transform duration-700 transform-style-3d group-hover:scale-105 transition-all">

                            {/* Front (Face) */}
                            <div className={cn(
                                "absolute inset-0 backface-hidden rounded-xl border border-[var(--color-soft-gold)]/50 overflow-hidden shadow-2xl bg-zinc-900",
                                !isRevealed && "hidden" // optimization
                            )}>
                                <div className="w-full h-full bg-zinc-900 border-none relative">
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                </div>
                                <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent p-4 flex flex-col justify-end">
                                    <p className="text-[var(--color-soft-gold)] text-xs uppercase tracking-widest mb-1">{card.position}</p>
                                    <h3 className="text-white font-serif text-lg leading-tight">{card.name}</h3>
                                </div>
                            </div>

                            {/* Back (Design) */}
                            <div className={cn(
                                "absolute inset-0 backface-hidden rotate-y-180 rounded-xl border border-[var(--color-soft-gold)]/20 bg-[var(--color-midnight-blue)] shadow-xl flex items-center justify-center",
                                isRevealed && "hidden" // optimization
                            )}>
                                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-midnight-green)_0%,_var(--color-midnight-blue)_100%)] p-4">
                                    <div className="w-full h-full border border-[var(--color-soft-gold)]/20 rounded-lg flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full border border-[var(--color-soft-gold)]/30" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Card Zoom Modal */}
            <AnimatePresence>
                {selectedCard && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedCard(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-lg w-full bg-[var(--color-card)] border border-[var(--color-soft-gold)]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedCard(null)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                <div className="aspect-[2/3] w-full max-w-[300px] mx-auto rounded-xl overflow-hidden border border-[var(--color-soft-gold)]/20 shadow-lg mb-6">
                                    <img
                                        src={selectedCard.image}
                                        alt={selectedCard.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="text-center space-y-4">
                                    <div>
                                        <p className="text-[var(--color-soft-gold)] text-sm uppercase tracking-widest font-bold mb-1">
                                            {selectedCard.position}
                                        </p>
                                        <h2 className="text-3xl font-serif font-bold text-[var(--color-foreground)]">
                                            {selectedCard.name}
                                        </h2>
                                    </div>

                                    <div className="w-16 h-px bg-[var(--color-soft-gold)]/30 mx-auto" />

                                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">
                                        {selectedCard.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] text-center">
                                <p className="text-xs text-[var(--color-muted-text)]">
                                    화면의 아무 곳이나 눌러서 닫기
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
