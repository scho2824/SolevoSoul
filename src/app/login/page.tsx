'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { Book, Moon, Star } from 'lucide-react'
import PIPAConsentModal from "@/components/Auth/PIPAConsentModal"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [showConsent, setShowConsent] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState<'google' | 'kakao' | null>(null)
    const supabase = createClient()

    // 1. User clicks login button -> Check if they selected a provider, then show consent
    const initiateLogin = (provider: 'google' | 'kakao') => {
        setSelectedProvider(provider)
        setShowConsent(true)
    }

    // 2. User agrees in Modal -> Trigger actual OAuth
    const handleConsentConfirm = async () => {
        setShowConsent(false)
        if (!selectedProvider) return

        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: selectedProvider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        if (error) {
            alert(error.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-10 left-10 text-lavender/20">
                <Moon size={120} />
            </div>
            <div className="absolute bottom-10 right-10 text-gold/20">
                <Star size={120} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md bg-midnight-blue/40 backdrop-blur-xl p-8 rounded-3xl border border-gold/20 shadow-2xl flex flex-col items-center"
            >
                <div className="bg-deep-green p-4 rounded-full mb-6 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                    <Book className="text-gold" size={40} />
                </div>

                <h1 className="text-4xl font-bold text-gold mb-2 tracking-tight">SolevoLog</h1>
                <p className="text-lavender/70 mb-10 text-center font-medium">당신의 타로 상담을 소중히 기록합니다</p>

                <div className="w-full space-y-4">
                    <button
                        onClick={() => initiateLogin('google')}
                        disabled={loading}
                        className="w-full py-4 px-6 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                        구글로 시작하기
                    </button>

                    <button
                        onClick={() => initiateLogin('kakao')}
                        disabled={loading}
                        className="w-full py-4 px-6 bg-[#FEE500] text-[#191919] rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#FDD835] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                    >
                        <span className="text-lg">K</span>
                        카카오로 시작하기
                    </button>
                </div>

                <p className="mt-8 text-xs text-lavender/40 text-center leading-relaxed">
                    로그인 시 SolevoLog의 이용약관 및 <br />
                    개인정보 처리방침에 동의하게 됩니다.
                </p>
            </motion.div>

            <div className="mt-8 text-gold/30 flex gap-4">
                <Star size={16} />
                <Star size={16} />
                <Star size={16} />
            </div>

            <PIPAConsentModal
                isOpen={showConsent}
                onConfirm={handleConsentConfirm}
                onCancel={() => setShowConsent(false)}
            />
        </div>
    )
}
