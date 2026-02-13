"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { getCardBackImage, getTarotCardImage } from "@/utils/tarotImages";
import { cn } from "@/lib/utils";

interface TarotCardProps {
    cardNameEn?: string;
    cardNameKr?: string;
    isRevealed: boolean;
    isReversed?: boolean;
    onClick?: () => void;
    size?: "sm" | "md" | "lg";
    className?: string;
    showLabel?: boolean;
}

export default function TarotCard({
    cardNameEn,
    cardNameKr,
    isRevealed,
    isReversed = false,
    onClick,
    size = "md",
    className,
    showLabel = true,
}: TarotCardProps) {
    const [imageError, setImageError] = useState(false);

    // Dimensions based on standard tarot ratio (~2:3.5)
    // sm: w-24, md: w-48, lg: w-64
    const sizeClasses = {
        sm: "w-24 h-40",
        md: "w-48 h-80", // Increased height for better aspect ratio
        lg: "w-72 h-[480px]",
    };

    const cardBack = getCardBackImage();
    const cardFront = cardNameEn ? getTarotCardImage(cardNameEn) : "";

    return (
        <div
            className={cn(
                "relative perspective-1000 cursor-pointer group",
                sizeClasses[size],
                className
            )}
            onClick={onClick}
        >
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-500 ease-in-out"
                animate={{
                    rotateY: isRevealed ? 180 : 0,
                    rotateZ: isRevealed && isReversed ? 180 : 0
                }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ scale: 1.05, y: -10 }}
            >
                {/* Back of Card (Face Down) */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl border border-white/10"
                    style={{ transform: "rotateY(0deg)" }}
                >
                    <Image
                        src={cardBack}
                        alt="Card Back"
                        fill
                        className="object-cover"
                    />
                    {/* Shininess overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Front of Card (Face Up) */}
                <div
                    className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-2xl border border-gold/30 bg-slate-900"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    {cardFront && !imageError ? (
                        <Image
                            src={cardFront}
                            alt={cardNameEn || "Tarot Card"}
                            fill
                            className="object-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-800 text-gold">
                            <span className="text-2xl font-serif mb-2">?</span>
                            <span className="text-xs">{cardNameKr || cardNameEn}</span>
                        </div>
                    )}

                    {/* Valid Image Overlay */}
                    {!imageError && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    )}

                    {/* Label */}
                    {showLabel && cardNameKr && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                            <p className={cn(
                                "text-white font-bold text-shadow",
                                size === "sm" ? "text-xs" : "text-sm"
                            )}>
                                {cardNameKr}
                            </p>
                            {isReversed && (
                                <p className="text-[10px] text-red-300 font-medium">(역방향)</p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
