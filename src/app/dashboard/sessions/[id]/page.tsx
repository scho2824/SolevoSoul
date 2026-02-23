"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Calendar, User, FileText, Sparkles, Clock, AlertTriangle, Send } from "lucide-react";
import Link from "next/link";
import TarotCard from "@/components/Tarot/TarotCard";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
    const [isMounted, setIsMounted] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
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

    const handleSendToClient = () => {
        // Mock sending to client (Kakao/SMS integration would go here)
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
            loading: '내담자에게 상담 요약을 전송하는 중...',
            success: '전송이 완료되었습니다!',
            error: '전송 실패'
        });
    };

    // Wait for hydration to complete to avoid server/client mismatch for Dates
    if (!isMounted) return null;

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-[var(--color-soft-gold)]">
                    <div className="w-10 h-10 border-4 border-current border-t-transparent rounded-full animate-spin" />
                    <p className="font-serif animate-pulse">상담 기록을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-slate-400">
                기록을 찾을 수 없습니다.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] lg:pl-64">
            <header className="border-b border-[#FDF2E9] bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/sessions" className="text-[#4A443F] hover:text-[var(--color-midnight-blue)] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                            <span className="text-[var(--color-soft-gold)] font-serif text-xl">{session.client.nickname}</span> 님의 상담 기록
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-[#4A443F] flex items-center gap-1.5 font-medium bg-[#FDFBF7] px-3 py-1.5 rounded-full border border-[#FDF2E9]">
                            <Calendar size={14} />
                            {new Date(session.created_at).toLocaleDateString()} {new Date(session.created_at).toLocaleTimeString()}
                        </div>
                        <button
                            onClick={handleSendToClient}
                            className="bg-[var(--color-midnight-blue)] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
                        >
                            <Send size={14} />
                            내담자에게 요약 전송
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
                {/* Summary / Metadata Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white border border-[#FDF2E9] p-4 rounded-xl flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#4A443F]">
                            <User size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-[#4A443F] font-medium">내담자</div>
                            <div className="font-bold text-[var(--foreground)]">{session.client.nickname}</div>
                        </div>
                    </div>
                    <div className="bg-white border border-[#FDF2E9] p-4 rounded-xl flex items-center gap-3 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#4A443F]">
                            <Clock size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-[#4A443F] font-medium">상담 시간</div>
                            <div className="font-bold text-[var(--foreground)]">50분 (예상)</div>
                        </div>
                    </div>
                    <div className="bg-white border border-[#FDF2E9] p-4 rounded-xl flex items-center gap-3 shadow-sm">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${session.risk_flags && session.risk_flags.length > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
                            <AlertTriangle size={18} />
                        </div>
                        <div>
                            <div className="text-xs text-[#4A443F] font-medium">위험 요인</div>
                            <div className={`font-bold ${session.risk_flags && session.risk_flags.length > 0 ? 'text-red-500' : 'text-[#4A443F]'}`}>
                                {session.risk_flags && session.risk_flags.length > 0 ? session.risk_flags.join(', ') : '없음'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarot Section (Visuals) */}
                {session.tarot_cards && session.tarot_cards.length > 0 && (
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold text-[var(--color-midnight-blue)] flex items-center gap-2">
                            <Sparkles size={18} className="text-[var(--color-soft-gold)]" />
                            타로 리딩: {session.tarot_question}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {session.tarot_cards.map((card, idx) => (
                                <div key={idx} className="flex flex-col items-center space-y-3">
                                    <TarotCard
                                        cardNameEn={card.card_name}
                                        cardNameKr={card.card_name}
                                        isRevealed={true}
                                        size="md"
                                        className="mx-auto shadow-lg"
                                    />
                                    <div className="text-center p-4 bg-white rounded-xl border border-[#FDF2E9] w-full shadow-sm">
                                        <p className="text-[var(--color-soft-gold)] font-bold text-sm mb-1">{card.card_name}</p>
                                        <p className="text-[#4A443F] text-xs mb-3 font-medium uppercase tracking-wider">{card.position_meaning}</p>
                                        <p className="text-[#4A443F] text-sm leading-relaxed text-left font-medium">
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
                    <section className="bg-white border border-[#FDF2E9] rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                        <h2 className="text-lg font-bold text-[var(--color-midnight-blue)] flex items-center gap-2">
                            <Sparkles size={18} className="text-[var(--color-soft-gold)]" />
                            AI 상담 분석 (SOAP)
                        </h2>
                        <div className="prose prose-stone max-w-none text-[#4A443F] whitespace-pre-wrap leading-relaxed">
                            {session.interpretation_text}
                        </div>
                    </section>
                )}

                {/* Full Transcript Section */}
                <section className="bg-white border border-[#FDF2E9] rounded-2xl p-6 lg:p-8 space-y-4 shadow-sm">
                    <h2 className="text-lg font-bold text-[#4A443F] flex items-center gap-2">
                        <FileText size={18} />
                        전체 녹취록
                    </h2>
                    <div className="bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl p-5 text-[#4A443F] text-sm whitespace-pre-wrap leading-relaxed h-64 overflow-y-auto custom-scrollbar">
                        {session.transcript_text || "녹취 기록이 없습니다."}
                    </div>
                </section>

            </main>
        </div>
    );
}
