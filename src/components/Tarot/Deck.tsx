"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DeckProps {
    onDraw: (count: number) => void;
    isShuffling: boolean;
}

export default function TarotDeck({ onDraw, isShuffling }: DeckProps) {
    const cards = Array.from({ length: 5 }, (_, i) => i);
    const [dragged, setDragged] = useState(false);
    // Generate static random values for the shuffle effect to avoid impure render calls
    // We use a fixed seed-like approach or just useMemo to keep them stable during render
    const randomOffsets = cards.map((i) => ({
        rotateZ: (i * 33 % 10) - 5, // Pseudo-random based on index
        x: (i * 47 % 20) - 10,
        y: (i * 71 % 20) - 10
    }));

    return (
        <div className="relative w-48 h-72 mx-auto perspective-1000 group">
            {cards.map((index) => {
                const offset = index * 2;
                const isTopCard = index === cards.length - 1;
                const randomOffset = randomOffsets[index];

                return (
                    <motion.div
                        key={index}
                        drag={isTopCard && !isShuffling}
                        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        dragElastic={0.6}
                        onDragStart={() => setDragged(true)}
                        onDragEnd={(_, info) => {
                            setDragged(false);
                            // Draw if dragged significantly
                            if (info.offset.y < -100 || info.offset.x > 100 || info.offset.x < -100) {
                                onDraw(1);
                            }
                        }}
                        className={cn(
                            "absolute inset-0 rounded-xl border-2 border-[var(--color-soft-gold)]/30 bg-[var(--color-midnight-blue)] shadow-xl",
                            "flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
                        )}
                        style={{
                            zIndex: index,
                            rotateZ: isShuffling ? randomOffset.rotateZ : 0,
                            x: isShuffling ? randomOffset.x : offset,
                            y: isShuffling ? randomOffset.y : -offset,
                        }}
                        animate={isShuffling ? {
                            x: [0, 50, -50, 0],
                            y: [0, -20, 20, 0],
                            rotateZ: [0, 15, -15, 0],
                            scale: [1, 1.1, 1],
                        } : {
                            x: offset,
                            y: -offset,
                            rotateZ: 0,
                            scale: 1
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: isShuffling ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                    >
                        {/* Card Back Design */}
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-midnight-green)_0%,_var(--color-midnight-blue)_100%)] p-2">
                            <div className="w-full h-full border border-[var(--color-soft-gold)]/20 flex items-center justify-center opacity-50">
                                <div className="w-20 h-20 rounded-full border border-[var(--color-soft-gold)]/40 flex items-center justify-center">
                                    <div className="w-16 h-16 rotate-45 border border-[var(--color-soft-gold)]/40" />
                                </div>
                            </div>
                        </div>

                        {/* Hover/Interact Glow */}
                        {isTopCard && (
                            <div className="absolute inset-0 bg-[var(--color-soft-gold)]/0 group-hover:bg-[var(--color-soft-gold)]/10 transition-colors duration-300" />
                        )}
                    </motion.div>
                );
            })}

            {/* Instruction Tooltip */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center w-60 pointer-events-none"
            >
                <p className="text-[var(--color-soft-gold)] text-sm font-bold animate-pulse">
                    {isShuffling
                        ? "카드의 에너지를 섞는 중..."
                        : "카드를 드래그하여 뽑아주세요"}
                </p>
                {!isShuffling && (
                    <p className="text-xs text-[#4A443F] font-medium mt-1">
                        위로 끌어올리거나 옆으로 던지세요
                    </p>
                )}
            </motion.div>
        </div>
    );
}
