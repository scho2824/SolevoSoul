"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function AuthPage() {
    const router = useRouter();
    const supabase = createClient();

    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                // Login Logic
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
                router.push("/dashboard");
            } else {
                // Signup Logic
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage("Check your email for the confirmation link!");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] to-[#FDF2E9] z-0" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-soft-gold)]/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl animate-pulse delay-700" />

            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-[var(--color-midnight-blue)] mb-2 font-bold">
                        Solevo Log
                    </h1>
                    <p className="text-[#4A443F] text-sm">
                        당신의 마음을 비추는 따뜻한 거울
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 mb-4 flex items-center gap-2 text-red-200 text-sm"
                        >
                            <AlertCircle size={16} />
                            {error}
                        </motion.div>
                    )}
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 mb-4 flex items-center gap-2 text-green-200 text-sm"
                        >
                            <CheckCircle2 size={16} />
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#4A443F] mb-1 font-bold">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/60 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--color-soft-gold)] focus:ring-2 focus:ring-[var(--color-soft-gold)]/20 transition-all shadow-sm"
                            placeholder="hello@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-[#4A443F] mb-1 font-bold">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-white/60 border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--foreground)] outline-none focus:border-[var(--color-soft-gold)] focus:ring-2 focus:ring-[var(--color-soft-gold)]/20 transition-all shadow-sm"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[var(--color-soft-gold)] hover:bg-[#E08328] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-900/10 mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin text-white" size={20} />
                        ) : (
                            isLogin ? "로그인" : "회원가입"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                            setMessage(null);
                        }}
                        className="text-sm font-medium text-[#4A443F] hover:text-[var(--color-midnight-blue)] transition-colors"
                    >
                        {isLogin ? "계정이 없으신가요? 회원가입" : "이미 계정이 있으신가요? 로그인"}
                    </button>

                    <div className="pt-6 border-t border-[var(--card-border)]">
                        <p className="text-xs text-[#4A443F] font-medium">
                            도움이 필요하신가요? <span className="text-[var(--color-soft-gold)] underline cursor-pointer hover:text-[var(--color-midnight-blue)]">고객센터 문의</span>
                        </p>
                        <p className="text-[10px] text-[#4A443F]/60 mt-4 font-normal tracking-wider">
                            © {new Date().getFullYear()} Axis Lab. All rights reserved.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
