"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, Book, Clock, Sun, Moon, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ClientDashboard() {
    const [timeOfDay, setTimeOfDay] = useState<"day" | "night">("day");
    const [upcomingSession, setUpcomingSession] = useState(false); // Mock state: Set to false to show Tarot Entry

    useEffect(() => {
        // Wrap in setTimeout to avoid synchronous state update warning
        setTimeout(() => {
            const hour = new Date().getHours();
            setTimeOfDay(hour > 6 && hour < 18 ? "day" : "night");
        }, 0);
    }, []);

    return (
        <div className="space-y-8">
            {/* Header / Greeting */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-serif text-[var(--color-foreground)]">
                        환영합니다, 지수님
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        오늘은 마음이 조금 더 가벼워지셨나요?
                    </p>
                </div>
                <div className="p-3 bg-[var(--color-midnight-green)] rounded-full border border-white/5">
                    {timeOfDay === "day" ? (
                        <Sun className="w-5 h-5 text-[var(--color-soft-gold)]" />
                    ) : (
                        <Moon className="w-5 h-5 text-[var(--color-soft-gold)]" />
                    )}
                </div>
            </motion.div>

            {/* Adaptive Hero Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={cn(
                    "w-full rounded-3xl p-6 relative overflow-hidden transition-all duration-500",
                    upcomingSession
                        ? "bg-gradient-to-br from-[var(--color-deep-green)] to-[var(--color-midnight-blue)] border border-emerald-500/30"
                        : "bg-white/5 border border-white/10"
                )}
            >
                <div className="relative z-10">
                    {upcomingSession ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-emerald-100">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm font-medium tracking-wide uppercase">Upcoming Session</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif text-white mb-2">오늘 오후 8:00</h2>
                                <p className="text-emerald-200/80">상담사 김서연님과의 세션이 예정되어 있습니다.</p>
                            </div>
                            <Link href="/dashboard/live" className="w-full bg-[var(--color-soft-gold)] hover:bg-yellow-600 text-[var(--color-midnight-blue)] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-900/40">
                                <Video className="w-5 h-5" />
                                <span>세션 입장하기</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 text-slate-300">
                                <Book className="w-5 h-5" />
                                <span className="text-sm font-medium tracking-wide uppercase">Daily Journal</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif text-white mb-2">오늘의 감정 기록</h2>
                                <p className="text-slate-400">타로 카드를 뽑고 오늘의 기분을 기록해보세요.</p>
                            </div>
                            <Link href="/session/tarot" className="w-full bg-[var(--color-midnight-green)] hover:bg-emerald-900 text-emerald-100 border border-emerald-500/30 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                                <Sparkles className="w-5 h-5" />
                                <span>타로 리딩 시작하기</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Decorative Background Blur */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                    <Calendar className="w-6 h-6 text-slate-400 group-hover:text-[var(--color-soft-gold)] mb-3 transition-colors" />
                    <h3 className="font-medium text-slate-200">일정 관리</h3>
                    <p className="text-xs text-slate-500 mt-1">다음 예약 확인</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="w-full h-full flex flex-col items-start">
                        {/* Placeholder for Crisis Button logic triggering */}
                        <h3 className="font-medium text-slate-200">SOS</h3>
                        <p className="text-xs text-slate-500 mt-1">긴급 도움 요청</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
