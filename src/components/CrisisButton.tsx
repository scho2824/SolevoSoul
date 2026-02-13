"use client";

import { useState } from "react";
import { Phone, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CrisisButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <motion.button
                className="fixed bottom-6 right-6 w-14 h-14 bg-red-900/80 hover:bg-red-800 text-red-200 border border-red-500/30 rounded-full flex items-center justify-center shadow-lg shadow-red-900/30 z-40 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
            >
                <AlertTriangle className="w-6 h-6" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-sm bg-zinc-900 border border-red-900/50 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="bg-red-900/20 p-6 text-center border-b border-red-900/30">
                                <div className="mx-auto w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center mb-4">
                                    <Phone className="w-8 h-8 text-red-400" />
                                </div>
                                <h2 className="text-xl font-bold text-red-100 mb-1">긴급 도움 요청</h2>
                                <p className="text-sm text-red-300/70">
                                    혼자가 아닙니다. 전문가의 도움이 필요하신가요?
                                </p>
                            </div>

                            <div className="p-4 space-y-3">
                                <a
                                    href="tel:1393"
                                    className="flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700 hover:border-red-500/50 transition-colors group"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-slate-200">자살예방상담전화</div>
                                        <div className="text-xs text-slate-500">24시간 운영</div>
                                    </div>
                                    <div className="text-xl font-bold text-red-400 group-hover:text-red-300">1393</div>
                                </a>
                                <a
                                    href="tel:1577-0199"
                                    className="flex items-center justify-between p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl border border-zinc-700 hover:border-red-500/50 transition-colors group"
                                >
                                    <div className="text-left">
                                        <div className="font-bold text-slate-200">정신건강상담전화</div>
                                        <div className="text-xs text-slate-500">24시간 운영</div>
                                    </div>
                                    <div className="text-xl font-bold text-red-400 group-hover:text-red-300">1577-0199</div>
                                </a>
                            </div>

                            <div className="p-4 bg-zinc-950/50 border-t border-white/5">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-slate-400 font-medium transition-colors"
                                >
                                    닫기
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
