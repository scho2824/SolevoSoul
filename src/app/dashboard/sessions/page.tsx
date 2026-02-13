"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight, Sparkles, Loader2, MessageSquare, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

// Simple helper to get days in month
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

export default function SessionsPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
    const supabase = createClient();

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('sessions')
            .select('*, clients(nickname)')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching sessions:', error);
        } else {
            setSessions(data || []);
        }
        setLoading(false);
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-transparent" />);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const daySessions = sessions.filter(s => s.created_at.startsWith(dateStr));
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

            days.push(
                <div key={day} className={`h-24 border border-card-border p-2 relative group hover:bg-white/5 transition-colors ${isToday ? 'bg-gold/5 border-gold/30' : 'bg-card'}`}>
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-gold' : 'text-slate-400'}`}>{day}</div>
                    <div className="space-y-1 overflow-y-auto max-h-[calc(100%-24px)] custom-scrollbar">
                        {daySessions.map((s) => (
                            <Link
                                href={`/dashboard/sessions/${s.id}`}
                                key={s.id}
                                className="block text-[10px] bg-white/10 p-1.5 rounded text-slate-200 truncate hover:bg-gold hover:text-midnight transition-colors"
                            >
                                {s.clients?.nickname || '내담자'}
                            </Link>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-card rounded-2xl border border-card-border overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-card-border">
                    <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="text-slate-400 hover:text-gold">&lt; 이전</button>
                    <h2 className="text-lg font-bold text-slate-200">
                        {year}년 {month + 1}월
                    </h2>
                    <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="text-slate-400 hover:text-gold">다음 &gt;</button>
                </div>
                <div className="grid grid-cols-7 text-center py-2 border-b border-card-border bg-midnight/50">
                    {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                        <div key={d} className="text-xs text-slate-500 font-medium">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 border-collapse">
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 min-h-[50vh]">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-serif text-gold">
                        상담 일정 및 기록
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        지난 상담과 타로 리딩의 여정
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-card border border-card-border rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('calendar')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'calendar' ? 'bg-gold text-midnight' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gold text-midnight' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <Link href="/dashboard/sessions/new" className="bg-gold text-midnight px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-gold/90 transition-colors flex items-center gap-2">
                        <span>+ 새 세션 기록</span>
                    </Link>
                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-gold" />
                    <p>상담 기록을 불러오는 중입니다...</p>
                </div>
            ) : (
                viewMode === 'calendar' ? renderCalendar() : (
                    <div className="space-y-4">
                        {/* List View Implementation (Existing) */}
                        {sessions.length > 0 ? sessions.map((session, i) => {
                            const date = new Date(session.created_at);
                            const isTarot = !!session.tarot_question;

                            return (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={`/dashboard/sessions/${session.id}`}
                                        className="block group bg-card border border-card-border hover:border-gold/30 hover:bg-white/5 p-5 rounded-2xl transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${isTarot ? 'bg-purple-900/50 text-purple-200' : 'bg-emerald-900/50 text-emerald-200'}`}>
                                                    {isTarot ? '타로 리딩' : '심리 상담'}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{date.toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                                                    <Clock className="w-3 h-3" />
                                                    <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-gold transition-colors" />
                                        </div>

                                        <h3 className="font-medium text-slate-200 mb-1 flex items-center gap-2 line-clamp-1">
                                            {session.summary_text || session.transcript_text?.slice(0, 50) + "..." || (isTarot ? session.tarot_question : "상담 내용 없음")}
                                            {isTarot && <Sparkles className="w-3 h-3 text-gold shrink-0" />}
                                        </h3>

                                        <div className="flex justify-between items-center text-sm text-slate-500 mt-2">
                                            <div className="flex items-center gap-2">
                                                {session.clients?.nickname && (
                                                    <span className="text-xs bg-black/30 px-2 py-0.5 rounded text-slate-400">
                                                        {session.clients.nickname}
                                                    </span>
                                                )}
                                            </div>

                                            {session.summary_text && (
                                                <span className="text-slate-400 text-xs">
                                                    요약 완료
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        }) : (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-card-border rounded-3xl bg-card">
                                <div className="w-16 h-16 rounded-full bg-midnight/50 flex items-center justify-center mb-4 text-slate-600">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <p className="text-slate-300 font-medium">아직 기록된 상담이 없습니다.</p>
                                <p className="text-slate-500 text-sm mt-1 mb-6">새로운 상담 세션을 시작해보세요.</p>
                                <Link href="/dashboard/sessions/new" className="px-6 py-2 bg-gold text-midnight rounded-lg font-bold text-sm hover:bg-gold/90 transition-colors">
                                    첫 세션 기록하기
                                </Link>
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
}
