"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import type { DrawnCard } from "@/hooks/useTarotDeck";

interface DigitalScribeProps {
    drawnCards: DrawnCard[];
    sessionId?: string;
}

interface LogEntry {
    timestamp: string;
    card: DrawnCard;
    message: string;
}

export default function DigitalScribe({ drawnCards, sessionId }: DigitalScribeProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const lastProcessedIndex = useRef(-1); // Track the last card we logged

    useEffect(() => {
        // Check if we have new cards to log
        if (drawnCards.length > lastProcessedIndex.current + 1) {
            const newLogs: LogEntry[] = [];

            // Loop through all new cards
            for (let i = lastProcessedIndex.current + 1; i < drawnCards.length; i++) {
                const newCard = drawnCards[i];
                const timestamp = new Date().toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const orientation = newCard.is_reversed ? '역방향' : '정방향';
                const keywords = newCard.keywords.slice(0, 3).join(', ');

                const message = `[${timestamp}] 카드 뽑음: ${newCard.name_kr} (${newCard.name_en}) - ${orientation}
위치: ${newCard.position_meaning}
키워드: ${keywords}
의미: ${newCard.is_reversed ? newCard.description_reversed : newCard.description_upright}`;

                newLogs.push({
                    timestamp,
                    card: newCard,
                    message
                });
            }

            // Wrap in setTimeout to avoid "setting state during render" warning from linter
            setTimeout(() => {
                setLogs(prev => [...prev, ...newLogs]);
                lastProcessedIndex.current = drawnCards.length - 1;
            }, 0);
        }
    }, [drawnCards]);

    if (logs.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">카드를 뽑으면 자동으로 기록됩니다</p>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-h-[500px] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <Clock className="w-4 h-4 text-[var(--color-soft-gold)]" />
                <h3 className="text-sm font-medium text-[var(--color-soft-gold)]">
                    Digital Scribe - 자동 기록
                </h3>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {logs.map((log, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black/20 rounded-lg p-4 border border-white/5"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-1 h-full bg-[var(--color-soft-gold)]/50 rounded-full" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-slate-400 font-mono">
                                            {log.timestamp}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${log.card.is_reversed
                                            ? 'bg-purple-900/30 text-purple-300'
                                            : 'bg-emerald-900/30 text-emerald-300'
                                            }`}>
                                            {log.card.is_reversed ? '역방향' : '정방향'}
                                        </span>
                                    </div>

                                    <h4 className="font-medium text-white mb-1">
                                        {log.card.name_kr} ({log.card.name_en})
                                    </h4>

                                    <p className="text-xs text-slate-400 mb-2">
                                        위치: {log.card.position_meaning}
                                    </p>

                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {log.card.keywords.slice(0, 4).map((keyword, i) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2 py-0.5 bg-white/5 text-slate-300 rounded"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {log.card.is_reversed
                                            ? log.card.description_reversed
                                            : log.card.description_upright}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
