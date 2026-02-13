"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Bell, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[var(--color-soft-gold)]" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-serif text-[var(--color-soft-gold)]">
                    내 프로필
                </h1>
                <p className="text-[var(--color-lavender)] text-sm mt-1">
                    개인정보 및 설정 관리
                </p>
            </header>

            <div className="bg-[var(--color-card)] border-[var(--color-card-border)] shadow-sm border border-[var(--color-card-border)] rounded-2xl p-6 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[var(--color-soft-gold)]/10 border-2 border-[var(--color-soft-gold)]/30 flex items-center justify-center shrink-0">
                    <User className="w-10 h-10 text-[var(--color-soft-gold)]" />
                </div>
                <div className="overflow-hidden">
                    <h2 className="text-xl font-bold text-[var(--color-foreground)] truncate">
                        {user?.user_metadata?.full_name || user?.user_metadata?.name || '사용자'}
                    </h2>
                    <p className="text-[var(--color-lavender)] text-sm truncate">{user?.email}</p>
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-[var(--color-soft-gold)]/20 text-[var(--color-soft-gold)] border border-[var(--color-soft-gold)]/30">
                        {user?.app_metadata?.provider || 'Email'} Login
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-[var(--color-lavender)] text-sm font-medium uppercase tracking-wider ml-1">Settings</h3>

                <button className="w-full flex items-center gap-4 p-4 bg-[var(--color-card)] border-[var(--color-card-border)] shadow-sm hover:bg-white/10 rounded-xl border border-[var(--color-card-border)] transition-colors text-left group">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-midnight-green)]/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[var(--color-midnight-green)]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-[var(--color-foreground)]">개인정보 보호 및 보안</h4>
                        <p className="text-xs text-[var(--color-lavender)]">비밀번호 변경, 2단계 인증</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--color-lavender)] group-hover:text-[var(--color-foreground)]" />
                </button>

                <button className="w-full flex items-center gap-4 p-4 bg-[var(--color-card)] border-[var(--color-card-border)] shadow-sm hover:bg-white/10 rounded-xl border border-[var(--color-card-border)] transition-colors text-left group">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-soft-gold)]/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-[var(--color-soft-gold)]" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-[var(--color-foreground)]">알림 설정</h4>
                        <p className="text-xs text-[var(--color-lavender)]">세션 알림, 마케팅 수신 동의</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--color-lavender)] group-hover:text-[var(--color-foreground)]" />
                </button>
            </div>
        </div>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
    )
}
