"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function IntakeFormPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        concerns: [] as string[],
        sleepQuality: "",
        stressLevel: 5,
        medication: "",
        goals: "",
    });

    const toggleConcern = (concern: string) => {
        setFormData((prev) => ({
            ...prev,
            concerns: prev.concerns.includes(concern)
                ? prev.concerns.filter((c) => c !== concern)
                : [...prev.concerns, concern],
        }));
    };

    const handleNext = () => setStep((prev) => prev + 1);

    return (
        <div className="min-h-screen bg-[var(--background)] p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
                    <motion.div
                        className="h-full bg-[var(--color-soft-gold)]"
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <div className="mt-4 mb-8">
                    <h1 className="text-2xl font-serif text-[var(--color-soft-gold)] mb-2">
                        사전 질문지
                    </h1>
                    <p className="text-slate-400 text-sm">
                        상담 전, 선생님께 남기고 싶은 이야기를 적어주세요.
                    </p>
                </div>

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                                현재 가장 큰 고민은 무엇인가요? (복수 선택 가능)
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {["대인관계", "진로/취업", "우울/불안", "가족갈등", "스트레스", "자존감"].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => toggleConcern(item)}
                                        className={cn(
                                            "p-3 rounded-xl text-sm border transition-all text-left",
                                            formData.concerns.includes(item)
                                                ? "bg-[var(--color-midnight-green)] border-emerald-500 text-emerald-100"
                                                : "bg-black/20 border-white/10 text-slate-400 hover:bg-black/40"
                                        )}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                                현재 스트레스 지수 (1-10)
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={formData.stressLevel}
                                onChange={(e) => setFormData({ ...formData, stressLevel: parseInt(e.target.value) })}
                                className="w-full accent-[var(--color-soft-gold)]"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>평온함</span>
                                <span>매우 심각</span>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full bg-[var(--color-soft-gold)] hover:bg-yellow-600 text-[var(--color-midnight-blue)] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4"
                        >
                            다음 <ChevronRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                상담을 통해 이루고 싶은 목표
                            </label>
                            <textarea
                                value={formData.goals}
                                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                                className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-slate-200 outline-none focus:border-[var(--color-soft-gold)] resize-none"
                                placeholder="자유롭게 작성해주세요..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                복용 중인 약물이 있나요?
                            </label>
                            <input
                                type="text"
                                value={formData.medication}
                                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-slate-200 outline-none focus:border-[var(--color-soft-gold)]"
                                placeholder="없음 / 약물명"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3.5 rounded-xl bg-zinc-800 text-slate-400 hover:bg-zinc-700 font-medium"
                            >
                                이전
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex-[2] bg-[var(--color-soft-gold)] hover:bg-yellow-600 text-[var(--color-midnight-blue)] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
                            >
                                제출하기 <CheckCircle className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-20 h-20 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">제출이 완료되었습니다</h2>
                        <p className="text-slate-400 text-sm mb-8">
                            작성해주신 내용은 담당 선생님께<br />안전하게 전달되었습니다.
                        </p>
                        <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-slate-200 font-bold py-3.5 rounded-xl">
                            홈으로 돌아가기
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
