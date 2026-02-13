"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PIPAConsentModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function PIPAConsentModal({
    isOpen,
    onConfirm,
    onCancel,
}: PIPAConsentModalProps) {
    const [agreedService, setAgreedService] = useState(false);
    const [agreedSensitive, setAgreedSensitive] = useState(false);

    const allAgreed = agreedService && agreedSensitive;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md bg-zinc-900 border border-emerald-900/50 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 space-y-6">
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center mb-4">
                                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-100">
                                    개인정보 처리 방침 동의
                                </h2>
                                <p className="text-sm text-slate-400">
                                    서비스 이용을 위해 아래 필수 항목에 동의해주세요.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Service Use Agreement */}
                                <div
                                    className={cn(
                                        "flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer",
                                        agreedService
                                            ? "bg-emerald-950/30 border-emerald-500/50"
                                            : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                                    )}
                                    onClick={() => setAgreedService(!agreedService)}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors",
                                        agreedService ? "bg-emerald-500 border-emerald-500" : "border-zinc-500"
                                    )}>
                                        {agreedService && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium text-slate-200 text-sm">
                                            (필수) 서비스 이용약관 동의
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            서비스 이용을 위한 기본적인 약관입니다.
                                        </p>
                                    </div>
                                </div>

                                {/* Sensitive Data Processing Agreement */}
                                <div
                                    className={cn(
                                        "flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer",
                                        agreedSensitive
                                            ? "bg-emerald-950/30 border-emerald-500/50"
                                            : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                                    )}
                                    onClick={() => setAgreedSensitive(!agreedSensitive)}
                                >
                                    <div className={cn(
                                        "w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors",
                                        agreedSensitive ? "bg-emerald-500 border-emerald-500" : "border-zinc-500"
                                    )}>
                                        {agreedSensitive && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium text-slate-200 text-sm">
                                            (필수) 민감정보 처리 동의 (심리/상담 위주)
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            상담 기록 및 심리 상태 분석을 위한 정보 처리에 동의합니다.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!allAgreed && (
                                <div className="flex items-center gap-2 p-3 bg-amber-900/20 text-amber-500 rounded-lg text-xs">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span>서비스 이용을 위해 모든 필수 항목에 동의해야 합니다.</span>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-3 px-4 rounded-xl text-sm font-medium text-slate-400 hover:bg-zinc-800 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={!allAgreed}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all shadow-lg",
                                        allAgreed
                                            ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20"
                                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                    )}
                                >
                                    동의하고 시작하기
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
