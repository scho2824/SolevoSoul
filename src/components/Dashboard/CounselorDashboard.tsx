"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, BarChart3, ChevronRight, User, AlertTriangle, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import SendCardModal from "@/components/Tarot/SendCardModal";

interface ClientStats {
    totalClients: number;
    todaySessions: number;
    retentionRate: number;
    inactiveCount: number;
}

interface ClientPreview {
    id: string;
    nickname: string;
    last_session_date: string | null;
    status: string;
    phone_encrypted?: string; // For SMS, assuming we can decrypt or use hash for lookup in real app
}

export default function CounselorDashboard() {
    const [stats, setStats] = useState<ClientStats>({
        totalClients: 0,
        todaySessions: 0,
        retentionRate: 100,
        inactiveCount: 0
    });
    const [recentClients, setRecentClients] = useState<ClientPreview[]>([]);
    const [inactiveClients, setInactiveClients] = useState<ClientPreview[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientPreview | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Fetch Clients
            // Note: 'status' and 'phone_encrypted' temporarily removed to prevent schema errors if migration not applied
            const { data: clients, error: clientError } = await supabase
                .from('clients')
                .select('id, nickname, created_at')
                .eq('counselor_id', user.id);

            if (clientError) throw clientError;

            // 2. Fetch Sessions to calculate stats
            const { data: sessions, error: sessionError } = await supabase
                .from('sessions')
                .select('client_id, date')
                .eq('counselor_id', user.id)
                .order('date', { ascending: false });

            if (sessionError) throw sessionError;

            // Process Data
            const totalClients = clients?.length || 0;

            // Today's Sessions
            const today = new Date().toISOString().split('T')[0];
            const todaySessionsCount = sessions?.filter(s => s.date.startsWith(today)).length || 0;

            // Calculate Inactive Clients (No session in 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const lastSessionMap = new Map<string, Date>();
            sessions?.forEach(s => {
                const d = new Date(s.date);
                if (!lastSessionMap.has(s.client_id) || d > lastSessionMap.get(s.client_id)!) {
                    lastSessionMap.set(s.client_id, d);
                }
            });

            const inactiveList: ClientPreview[] = [];
            const activeList: ClientPreview[] = [];

            clients?.forEach(c => {
                const lastDate = lastSessionMap.get(c.id);
                // Default status to 'Active' if column missing/undefined (schema mismatch safe)
                // const clientStatus = c.status || 'Active';
                const isInactive = !lastDate || lastDate < thirtyDaysAgo;

                const clientData = {
                    ...c,
                    status: 'Active', // Fallback
                    phone_encrypted: '', // Fallback
                    last_session_date: lastDate ? lastDate.toISOString().split('T')[0] : '기록 없음',
                    // status: isInactive ? 'Inactive' : 'Active' // We can still calculate local status logic
                };

                // Override status locally based on retention
                // clientData.status = isInactive ? 'Inactive' : 'Active';

                if (isInactive) inactiveList.push({ ...clientData, status: 'Inactive' });
                else activeList.push({ ...clientData, status: 'Active' });
            });

            // Mock Retention Rate (Active / Total)
            const retentionRate = totalClients > 0 ? Math.round((activeList.length / totalClients) * 100) : 0;

            setStats({
                totalClients,
                todaySessions: todaySessionsCount,
                retentionRate,
                inactiveCount: inactiveList.length
            });

            setRecentClients(activeList.slice(0, 5)); // Show top 5 active
            setInactiveClients(inactiveList.slice(0, 3)); // Show top 3 inactive for alert

        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-serif text-gold">상담사 대시보드</h1>
                    <p className="text-slate-400 text-sm mt-1">내담자 현황 및 여정 지도</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/session/tarot" className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 transition-colors flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> 타로 상담
                    </Link>
                    <Link href="/dashboard/clients" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-400 hover:text-foreground hover:bg-white/10 transition-colors flex items-center gap-2">
                        <Users className="w-4 h-4" /> 내담자 관리
                    </Link>
                    <Link href="/dashboard/sessions/new" className="px-4 py-2 bg-gold border border-gold/50 rounded-lg text-sm text-midnight hover:bg-gold/90 transition-colors flex items-center gap-2 font-medium">
                        + 일정 추가
                    </Link>
                </div>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card shadow-sm border border-card-border p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Total Clients</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{loading ? '-' : stats.totalClients}</p>
                </div>
                <div className="bg-card shadow-sm border border-card-border p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Today&apos;s Sessions</span>
                    </div>
                    <p className="text-2xl font-bold text-gold">{loading ? '-' : stats.todaySessions}</p>
                </div>
                <div className="bg-card shadow-sm border border-card-border p-4 rounded-xl">
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Retention Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-sage">{loading ? '-' : `${stats.retentionRate}%`}</p>
                </div>
                {/* Retention Alert Box */}
                <div className={`shadow-sm border p-4 rounded-xl transition-all ${stats.inactiveCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-card border-card-border'}`}>
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <AlertTriangle className={`w-4 h-4 ${stats.inactiveCount > 0 ? 'text-red-400' : ''}`} />
                        <span className="text-xs uppercase tracking-wider">Risk (Inactive)</span>
                    </div>
                    <p className={`text-2xl font-bold ${stats.inactiveCount > 0 ? 'text-red-400' : 'text-slate-500'}`}>
                        {loading ? '-' : stats.inactiveCount}
                    </p>
                </div>
            </div>

            {/* Retention Risk Section */}
            {inactiveClients.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--color-card)] border border-red-500/20 rounded-xl p-5"
                >
                    <h3 className="text-sm font-bold text-red-300 flex items-center gap-2 mb-4">
                        <AlertTriangle size={16} />
                        관리 필요 내담자 (30일 이상 미방문)
                    </h3>
                    <div className="grid gap-3">
                        {inactiveClients.map((client) => (
                            <div key={client.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-xs">
                                        {client.nickname[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{client.nickname}</p>
                                        <p className="text-xs text-slate-500">마지막 방문: {client.last_session_date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedClient(client);
                                        setIsModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs rounded-lg transition-colors flex items-center gap-1"
                                >
                                    <Send size={12} /> 안부 문자 보내기
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Active Client List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-foreground">최근 활동 내담자</h2>
                    <Link href="/dashboard/clients" className="text-xs text-gold hover:underline flex items-center gap-1">
                        전체 보기 <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-10 text-slate-500">데이터를 불러오는 중...</div>
                    ) : recentClients.map((client, i) => (
                        <motion.div
                            key={client.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group flex items-center justify-between p-4 bg-card hover:bg-white/5 border border-card-border hover:border-gold/60 rounded-xl cursor-pointer transition-all shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">{client.nickname}</h3>
                                    <p className="text-xs text-slate-400">
                                        최근 세션: <span className="text-sage">{client.last_session_date}</span>
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-foreground transition-colors" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Send Message Modal */}
            {selectedClient && (
                <SendCardModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    cardName="오늘의 위로"
                    cardDesc="오랫동안 뵙지 못해 안부가 궁금합니다. 편하실 때 연락주시면, 따뜻한 차 한 잔과 함께 기다리겠습니다."
                    clientName={selectedClient.nickname}
                    clientPhone={selectedClient.phone_encrypted || ''} // In real app, decrypt this
                />
            )}
        </div>
    );
}
