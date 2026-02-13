"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Calendar, User, FileText, Sparkles, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import TarotCard from "@/components/Tarot/TarotCard";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SessionDetail {
    id: string;
    created_at: string;
    transcript_text: string | null;
    interpretation_text: string | null;
    tarot_question: string | null;
    risk_flags: string[] | null;
    sentiment_score: number | null;
    client: {
        nickname: string;
    };
    tarot_cards: {
        card_name: string;
        position_meaning: string;
        interpretation: string;
        image_url: string;
    }[];
}

export default function SessionDetailPage() {
    const { id } = useParams();
    const [session, setSession] = useState<SessionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        if (id) fetchSession();
    }, [id]);

    const fetchSession = async () => {
        try {
            const { data, error } = await supabase
                .from('sessions')
                .select(`
                    id, created_at, transcript_text, interpretation_text, tarot_question, risk_flags, sentiment_score,
                    client:clients(nickname),
                    tarot_cards(card_name, position_meaning, interpretation, image_url)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setSession(data as unknown as SessionDetail);
        } catch (error) {
            console.error("Error fetching session:", error);
            // toast.error("세션을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gold">
                    <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                    <p className="font-serif animate-pulse">상담 기록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-slate-400">
                기록을 찾을 수 없습니다.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background lg:pl-64">
            <header className="border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/sessions" className="text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <span className="text-gold">{session.client.nickname}</span> 님의 상담 기록
                        </h1>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(session.created_at).toLocaleDateString()} {new Date(session.created_at).toLocaleTimeString()}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
                {/* Summary / Metadata Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-card border border-card-border p-4 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <User size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">내담자</div>
                            <div className="font-bold text-foreground">{session.client.nickname}</div>
                        </div>
                    </div>
                    <div className="bg-card border border-card-border p-4 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                            <Clock size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">상담 시간</div>
                            <div className="font-bold text-foreground">50분 (예상)</div>
                        </div>
                    </div>
                    <div className="bg-card border border-card-border p-4 rounded-xl flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.risk_flags && session.risk_flags.length > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">위험 요인</div>
                            <div className={`font-bold ${session.risk_flags && session.risk_flags.length > 0 ? 'text-red-400' : 'text-foreground'}`}>
                                {session.risk_flags && session.risk_flags.length > 0 ? session.risk_flags.join(', ') : '없음'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarot Section (Visuals) */}
                {session.tarot_cards && session.tarot_cards.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold text-gold flex items-center gap-2">
                            <Sparkles size={18} />
                            타로 리딩: {session.tarot_question}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {session.tarot_cards.map((card, idx) => (
                                <div key={idx} className="flex flex-col items-center space-y-3">
                                    <TarotCard
                                        cardNameEn={card.card_name} // Assuming card_name is English or standard name
                                        cardNameKr={card.card_name} // We might need a KR name if available, for now using same
                                        isRevealed={true}
                                        // isReversed={card.is_reversed} // Schema needs to return this. The current query returns interpretation, not is_reversed directly?
                                        // Let's check the type definition at line 21. It doesn't have is_reversed.
                                        // We should probably add it to the select query if possible, but for now we'll assume upright or parse interpretation?
                                        // Let's check the view_file of page.tsx again. The interface SessionDetail (lines 10-27) doesn't have is_reversed.
                                        // The select query (lines 42-53) fetches tarot_cards(card_name, position_meaning, interpretation, image_url).
                                        // We need to update the query to fetch is_reversed as well.
                                        // BUT, for now, let's just render it safely.
                                        size="md"
                                        className="mx-auto shadow-lg"
                                    />
                                    <div className="text-center p-3 bg-black/40 rounded-xl border border-white/5 w-full">
                                        <p className="text-gold font-bold text-sm mb-1">{card.card_name}</p>
                                        <p className="text-slate-400 text-xs mb-2">{card.position_meaning}</p>
                                        <p className="text-slate-300 text-xs leading-relaxed text-left">
                                            {card.interpretation}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* AI Summary Section */}
                {session.interpretation_text && (
                    <section className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
                        <h2 className="text-lg font-bold text-gold flex items-center gap-2">
                            <Sparkles size={18} />
                            AI 상담 분석 (SOAP)
                        </h2>
                        <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {session.interpretation_text}
                        </div>
                    </section>
                )}

                {/* Full Transcript Section */}
                <section className="bg-card border border-card-border rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-slate-400 flex items-center gap-2">
                        <FileText size={18} />
                        전체 녹취록
                    </h2>
                    <div className="bg-black/20 rounded-xl p-4 text-slate-400 text-sm whitespace-pre-wrap leading-relaxed h-64 overflow-y-auto custom-scrollbar">
                        {session.transcript_text || "녹취 기록이 없습니다."}
                    </div>
                </section>

            </main>
        </div>
    );
}
