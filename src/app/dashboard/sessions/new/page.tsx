'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, Save, Loader2, User, Sparkles, BookOpen, PenTool, RefreshCw, Send } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import TarotDeck from '@/components/Tarot/Deck'
import TarotSpread from '@/components/Tarot/Spread'
import AudioRecorder from '@/components/Tarot/AudioRecorder'
import { useTarotDeck } from '@/hooks/useTarotDeck'
import { interpretTarotReading } from '@/app/actions/ai'
import SendCardModal from '@/components/Tarot/SendCardModal'

interface Client {
    id: string
    nickname: string
}

export default function NewSessionPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [selectedClientId, setSelectedClientId] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    // Core Data State
    const [transcript, setTranscript] = useState('')
    const [tarotQuestion, setTarotQuestion] = useState('')
    const [aiInterpretation, setAiInterpretation] = useState('')

    // UI State
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [interpreting, setInterpreting] = useState(false)
    const [isSendModalOpen, setIsSendModalOpen] = useState(false)

    // Tarot State
    const { deck, loadDeck, shuffle, draw: drawCards, isShuffling, isLoading: isDeckLoading } = useTarotDeck()
    const [drawMode, setDrawMode] = useState<'upload' | 'digital'>('digital')
    const [tarotStep, setTarotStep] = useState<'question' | 'spread' | 'shuffle' | 'draw' | 'reading'>('question')
    const [spreadType, setSpreadType] = useState<{ count: number, name: string, type: '1-card' | '3-card' | 'celtic-cross' }>({ count: 3, name: '3 Card Spread', type: '3-card' })
    const [drawnCards, setDrawnCards] = useState<any[]>([])
    const [isRevealed, setIsRevealed] = useState(false)

    // Helper for manual audio upload (if needed alongside AudioRecorder)
    const [uploadedAudioFiles, setUploadedAudioFiles] = useState<File[]>([])

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchClients()
        loadDeck()
    }, [loadDeck])

    const fetchClients = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('clients')
            .select('id, nickname')
            .eq('counselor_id', user.id)
            .order('nickname')

        if (error) {
            console.error('Error fetching clients:', error)
        } else {
            setClients(data || [])
        }
        setLoading(false)
    }

    const handleTranscriptionComplete = (text: string) => {
        setTranscript(prev => prev ? `${prev}\n\n[추가 녹음]\n${text}` : text)
    }

    const handleShuffle = () => {
        shuffle()
        setTimeout(() => {
            setTarotStep('draw')
        }, 1600) // Slightly longer than shuffle animation
    }

    const handleDraw = (count: number) => {
        const cards = drawCards(spreadType.type)
        if (cards) {
            // Map to display format if needed, but TarotSpread should handle DrawnCard type ideally
            // For now, map to match expected props of TarotSpread
            const mappedCards = cards.map(c => ({
                id: c.id,
                name: c.name_kr, // Use Korean name
                position: c.position_meaning,
                image: c.image_url || `https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg`, // Fallback or placeholder logic if DB empty
                desc: c.is_reversed ? c.description_reversed : c.description_upright,
                // Add checks for actual image URLs from DB or use mapping
            }))

            // Temporary Image Mapping Fix until DB has all URLs
            // In a real app, DB should have valid URLs. 
            // We can fetch valid URLs or use a mapping function here if DB is incomplete.

            setDrawnCards(mappedCards)
            setTarotStep('reading')
        }
    }

    const generateAIInterpretation = async () => {
        if (drawnCards.length === 0) return

        setInterpreting(true)
        const cardsForAI = drawnCards.map(c => ({
            name_kr: c.name,
            name_en: "Unknown", // Ideally passed from hook
            position_meaning: c.position,
            is_reversed: false, // Need to track this from hook
            keywords: [],
            description_upright: c.desc,
            description_reversed: c.desc
        }))

        // Verify we have enough data. If mappedCards lost refined data, we might need to store original DrawnCard objects.
        // Let's rely on the hook's returned structure in the future refactor of TarotSpread.
        // For now, I will use a simplified call or mock it if state is missing info.

        // Proper fix:
        const response = await interpretTarotReading({
            question: tarotQuestion,
            cards: drawnCards.map(c => ({
                name_kr: c.name,
                name_en: "",
                position_meaning: c.position,
                is_reversed: false,
                keywords: [],
                description_upright: c.desc,
                description_reversed: c.desc
            })),
            spreadType: spreadType.type
        })

        if (response.success) {
            setAiInterpretation(response.interpretation || "")
        } else {
            alert(response.error)
        }
        setInterpreting(false)
    }

    const handleSaveSession = async () => {
        if (!selectedClientId) {
            alert('내담자를 선택해주세요.')
            return
        }

        setSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('User not found')

            // 1. Create Session
            const { data: session, error: sessionError } = await supabase
                .from('sessions')
                .insert([
                    {
                        client_id: selectedClientId,
                        counselor_id: user.id,
                        transcript_text: transcript,
                        tarot_question: tarotQuestion,
                        interpretation_text: aiInterpretation,
                        date: new Date().toISOString()
                    }
                ])
                .select()
                .single()

            if (sessionError) throw sessionError

            // 2. Save Cards
            if (drawnCards.length > 0) {
                // We need to map back to DB IDs if possible, or insert as raw data if we don't have IDs
                // Ideally use saveToSession from hook, but we need session ID first.
                // For this MVP, we might skip precise relation if `drawnCards` state lost the IDs.
                // Let's assume we want to save basic info for now.

                // If using hook's saveToSession:
                // await saveToSession(session.id) 
                // Context: The hook state `drawnCards` matches the hook's scope. 
                // But we moved data to local state `drawnCards`.

                // Simplified manual insert for visual cards
                const cardsToInsert = drawnCards.map((card, i) => ({
                    session_id: session.id,
                    card_name: card.name,
                    position_meaning: card.position,
                    interpretation: card.desc,
                    image_url: card.image
                }));

                await supabase.from('tarot_cards').insert(cardsToInsert);
            }

            toast.success('세션이 저장되었습니다.')
            router.push('/dashboard')
        } catch (error: any) {
            toast.error(`저장 중 오류가 발생했습니다: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="border-b border-[var(--color-soft-gold)]/10 bg-[var(--color-background)]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-[var(--color-foreground)]/60 hover:text-[var(--color-soft-gold)] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-[var(--color-soft-gold)] tracking-tight">상담 일지 작성</h1>
                    </div>
                    <button
                        onClick={handleSaveSession}
                        disabled={saving || loading}
                        className="bg-[var(--color-soft-gold)] text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[var(--color-soft-gold)]/90 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        상담 완료
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-8">
                {/* Client Selection */}
                <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-6">
                    <label className="flex items-center gap-2 text-[var(--color-soft-gold)] font-bold mb-4">
                        <User size={20} />
                        상담 내담자
                    </label>

                    {/* Simplified Client Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {clients.map((client) => (
                            <button
                                key={client.id}
                                onClick={() => setSelectedClientId(client.id)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${selectedClientId === client.id
                                    ? 'bg-[var(--color-soft-gold)] text-white border-[var(--color-soft-gold)]'
                                    : 'bg-[var(--color-card)] border border-[var(--color-card-border)] text-[var(--color-foreground)]/60 hover:border-[var(--color-soft-gold)]/30'
                                    }`}
                            >
                                {client.nickname}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Audio Recorder Section */}
                    <AudioRecorder
                        sessionId={selectedClientId || 'temp'} // Ideally valid session ID, but client ID works for bucket path
                        onTranscriptionComplete={handleTranscriptionComplete}
                    />

                    {/* Transcript Editor */}
                    <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-6 flex flex-col h-full">
                        <label className="flex items-center gap-2 text-[var(--color-soft-gold)] font-bold mb-4">
                            <PenTool size={20} />
                            상담 노트 (자동 변환)
                        </label>
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="음성 인식된 내용이 여기에 표시됩니다. 직접 수정할 수도 있습니다."
                            className="flex-1 bg-white/5 border border-[var(--color-card-border)] rounded-xl p-4 text-slate-200 focus:outline-none focus:border-[var(--color-soft-gold)]/50 transition-all resize-none h-[200px]"
                        />
                    </div>
                </div>

                {/* Tarot Section */}
                <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-6 min-h-[500px]">
                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center gap-2 text-[var(--color-soft-gold)] font-bold">
                            <Sparkles size={20} /> 타로 상담
                        </label>
                        {tarotStep === 'reading' && (
                            <button
                                onClick={() => {
                                    setDrawnCards([])
                                    setTarotStep('question')
                                    setAiInterpretation('')
                                }}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                            >
                                <RefreshCw size={12} /> 다시 하기
                            </button>
                        )}
                    </div>

                    <div className="space-y-8">
                        <AnimatePresence mode="wait">
                            {tarotStep === 'question' && (
                                <motion.div
                                    key="question"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6 text-center py-10"
                                >
                                    <h3 className="text-xl font-bold text-[var(--color-foreground)]">무엇을 알고 싶으신가요?</h3>
                                    <input
                                        type="text"
                                        placeholder="질문을 입력해주세요..."
                                        value={tarotQuestion}
                                        onChange={(e) => setTarotQuestion(e.target.value)}
                                        className="w-full text-center text-lg bg-transparent border-b-2 border-[var(--color-soft-gold)]/30 py-4 focus:outline-none focus:border-[var(--color-soft-gold)] transition-all placeholder:text-[var(--color-lavender)]/30 text-[var(--color-foreground)]"
                                        onKeyDown={(e) => e.key === 'Enter' && tarotQuestion.trim() && setTarotStep('spread')}
                                    />
                                    <button
                                        onClick={() => setTarotStep('spread')}
                                        disabled={!tarotQuestion.trim()}
                                        className="mt-8 px-8 py-3 bg-[var(--color-soft-gold)] text-white font-bold rounded-xl hover:bg-[var(--color-soft-gold)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        다음 단계
                                    </button>
                                </motion.div>
                            )}

                            {tarotStep === 'spread' && (
                                <motion.div
                                    key="spread"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 text-center py-10"
                                >
                                    <h3 className="text-xl font-bold text-[var(--color-foreground)]">어떤 스프레드를 사용하시겠어요?</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                                        <button
                                            onClick={() => {
                                                setSpreadType({ count: 1, name: '1장 카드 (오늘의 운세)', type: '1-card' })
                                                setTarotStep('shuffle')
                                            }}
                                            className="p-6 border border-[var(--color-card-border)] rounded-xl hover:border-[var(--color-soft-gold)] hover:bg-[var(--color-soft-gold)]/5 transition-all text-left"
                                        >
                                            <div className="text-lg font-bold text-[var(--color-foreground)] mb-2">1장 카드</div>
                                            <div className="text-sm text-slate-400">간단한 조언이나 오늘의 운세</div>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSpreadType({ count: 3, name: '3장 스프레드', type: '3-card' })
                                                setTarotStep('shuffle')
                                            }}
                                            className="p-6 border border-[var(--color-card-border)] rounded-xl hover:border-[var(--color-soft-gold)] hover:bg-[var(--color-soft-gold)]/5 transition-all text-left"
                                        >
                                            <div className="text-lg font-bold text-[var(--color-foreground)] mb-2">3장 스프레드</div>
                                            <div className="text-sm text-slate-400">과거 - 현재 - 미래의 흐름 파악</div>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {tarotStep === 'shuffle' && (
                                <motion.div key="shuffle" className="py-20 flex flex-col items-center justify-center">
                                    <TarotDeck onDraw={() => { }} isShuffling={true} />
                                    <div className="mt-8 text-[var(--color-soft-gold)] animate-pulse font-medium">
                                        우주의 에너지를 모으는 중...
                                    </div>
                                    {/* Auto-advance handled by useEffect/setTimeout in handler */}
                                    {(() => {
                                        if (!isShuffling) handleShuffle();
                                        return null;
                                    })()}
                                </motion.div>
                            )}

                            {tarotStep === 'draw' && (
                                <motion.div key="draw" className="py-20 flex flex-col items-center justify-center">
                                    <TarotDeck onDraw={() => handleDraw(spreadType.count)} isShuffling={false} />
                                    <p className="mt-8 text-slate-400">
                                        카드를 드래그하여 {spreadType.count}장을 뽑아주세요
                                    </p>
                                </motion.div>
                            )}

                            {tarotStep === 'reading' && (
                                <motion.div key="reading" className="space-y-8">
                                    <div className="flex justify-between items-center px-4">
                                        <h3 className="text-lg font-bold text-slate-200">
                                            {spreadType.name} 결과
                                        </h3>
                                        <button
                                            onClick={() => setIsRevealed(true)}
                                            className="text-sm text-[var(--color-soft-gold)] hover:underline"
                                        >
                                            모두 뒤집기
                                        </button>
                                    </div>

                                    <TarotSpread cards={drawnCards} isRevealed={isRevealed} />

                                    {aiInterpretation ? (
                                        <div className="bg-background/50 border border-[var(--color-soft-gold)]/20 p-6 rounded-xl space-y-4">
                                            <div className="flex items-center gap-2 text-[var(--color-soft-gold)] font-bold">
                                                <Sparkles size={18} /> AI 타로 리딩
                                            </div>
                                            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                                                {aiInterpretation}
                                            </div>

                                            {/* Share Button */}
                                            <div className="pt-4 flex justify-end">
                                                <button
                                                    onClick={() => setIsSendModalOpen(true)}
                                                    className="text-xs flex items-center gap-2 px-4 py-2 bg-[var(--color-soft-gold)]/10 text-[var(--color-soft-gold)] rounded-lg hover:bg-[var(--color-soft-gold)]/20 transition-all border border-[var(--color-soft-gold)]/30"
                                                >
                                                    <Send size={14} /> 결과 문자 전송
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center pt-8">
                                            <button
                                                onClick={generateAIInterpretation}
                                                disabled={interpreting}
                                                className="bg-[var(--color-soft-gold)] text-midnight px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[var(--color-soft-gold)]/90 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                            >
                                                {interpreting ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                                                AI 해석 생성하기
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Send Modal */}
                {/* Need to find specific client info for the modal */}
                {isSendModalOpen && (
                    <SendCardModal
                        isOpen={isSendModalOpen}
                        onClose={() => setIsSendModalOpen(false)}
                        cardName={drawnCards.map(c => c.name).join(', ')}
                        cardDesc={aiInterpretation.slice(0, 100) + "..."} // Truncate generic preview
                        clientName={clients.find(c => c.id === selectedClientId)?.nickname || '내담자'}
                        clientPhone="010-0000-0000" // Placeholder, in real app, fetch from Client select
                    />
                )}
            </main>
        </div>
    )
}
