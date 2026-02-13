'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageSquare, Check, Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { sendSMS } from '@/app/actions/sms'

interface SendCardModalProps {
    isOpen: boolean
    onClose: () => void
    cardName: string
    cardDesc: string
    clientName: string
    clientPhone: string
}

export default function SendCardModal({
    isOpen,
    onClose,
    cardName,
    cardDesc,
    clientName,
    clientPhone
}: SendCardModalProps) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [message, setMessage] = useState(
        `[SoulLog] ${clientName}님, 오늘의 타로 카드는 '${cardName}'입니다.\n\n"${cardDesc}"\n\n오늘 하루도 평온하시길 바랍니다.`
    )

    const handleSend = async () => {
        setLoading(true)
        try {
            const res = await sendSMS(clientPhone, message, '오늘의 타로')
            if (res.success) {
                setSuccess(true)
                toast.success(`${clientName}님에게 메시지를 전송했습니다.`)
                setTimeout(() => {
                    onClose()
                    setSuccess(false)
                }, 2000)
            } else {
                toast.error(`전송 실패: ${res.message}`)
            }
        } catch (error) {
            toast.error('전송 중 예기치 않은 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md bg-[var(--color-card)] border border-[var(--color-soft-gold)]/30 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-[var(--color-soft-gold)] flex items-center gap-2">
                                    <Sparkles size={20} />
                                    카드 메시지 보내기
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-2">
                                <label className="text-xs font-bold text-slate-400 block mb-1">받는 사람</label>
                                <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
                                    <span className="font-bold">{clientName}</span>
                                    <span className="text-slate-500">({clientPhone || '번호 없음'})</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 block">메시지 내용</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-[var(--color-foreground)] focus:border-[var(--color-soft-gold)]/50 focus:outline-none resize-none transition-all"
                                />
                            </div>

                            <button
                                onClick={handleSend}
                                disabled={loading || success || !clientPhone}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${success
                                    ? 'bg-green-500 text-white'
                                    : 'bg-[var(--color-soft-gold)] text-white hover:bg-[var(--color-soft-gold)]/90 disabled:opacity-50'
                                    }`}
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : success ? (
                                    <>
                                        <Check size={18} /> 전송 완료!
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} /> 전송하기
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
