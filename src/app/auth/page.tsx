"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PIPAConsentModal from "@/components/Auth/PIPAConsentModal";

export default function AuthPage() {
    const [showConsent, setShowConsent] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, validate form first, then show consent if it's a new signup
        setShowConsent(true);
    };

    const handleConsentConfirm = () => {
        setShowConsent(false);
        // Proceed with signup logic here (e.g., Supabase signUp)
        alert("PIPA Consent Granted. Proceeding with Signup...");
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)] to-[var(--color-midnight-blue)] z-0" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-deep-green)]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[var(--color-soft-gold)]/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-[var(--color-soft-gold)] mb-2">
                        Midnight Sanctuary
                    </h1>
                    <p className="text-slate-400 text-sm">
                        당신의 마음을 비추는 거울
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-[var(--color-soft-gold)] transition-colors"
                            placeholder="hello@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-slate-200 outline-none focus:border-[var(--color-soft-gold)] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[var(--color-soft-gold)] hover:bg-yellow-600 text-[var(--color-midnight-blue)] font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-900/20 mt-4"
                    >
                        로그인 / 회원가입
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-500">
                        도움이 필요하신가요? <span className="text-slate-300 underline cursor-pointer">고객센터 문의</span>
                    </p>
                </div>
            </motion.div>

            <PIPAConsentModal
                isOpen={showConsent}
                onConfirm={handleConsentConfirm}
                onCancel={() => setShowConsent(false)}
            />
        </div>
    );
}
