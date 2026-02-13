"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Shuffle, Loader2, ArrowLeft, Save } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTarotDeck, type SpreadType } from "@/hooks/useTarotDeck";
import DigitalScribe from "@/components/Tarot/DigitalScribe";
import { interpretTarotReading, saveTarotSession } from "@/app/actions/ai";
import Link from "next/link";
import { toast } from "sonner"; // Assuming sonner is used, or I'll use simple alerts if not available
import TarotCard from "@/components/Tarot/TarotCard";

import { Suspense } from "react";

function TarotSessionContent() {
    const [step, setStep] = useState<"intention" | "spread-select" | "shuffle" | "draw" | "reveal" | "result">("intention");
    const [question, setQuestion] = useState("");
    const [selectedSpread, setSelectedSpread] = useState<SpreadType>("3-card");
    const [interpretation, setInterpretation] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const searchParams = useSearchParams();
    const clientId = searchParams.get("clientId");

    // Custom hook for deck management
    const {
        deck,
        drawnCards,
        isShuffling,
        isLoading,
        loadDeck,
        shuffle,
        draw,
        reset
    } = useTarotDeck();

    useEffect(() => {
        loadDeck();
    }, [loadDeck]);

    const handleShuffle = async () => {
        await shuffle();
        setStep("draw");
    };

    const handleDraw = async () => {
        const cards = await draw(selectedSpread);
        if (cards && cards.length > 0) {
            setStep("reveal");
        }
    };

    const handleInterpret = async () => {
        setIsProcessing(true);
        try {
            // 1. Get AI Interpretation
            const result = await interpretTarotReading({
                question,
                cards: drawnCards,
                spreadType: selectedSpread
            });

            let finalInterpretation = "";

            if (result.success) {
                setInterpretation(result.interpretation);
                finalInterpretation = result.interpretation;
            } else {
                setInterpretation(result.interpretation); // Fallback text
                finalInterpretation = result.interpretation;
                console.warn('AI interpretation failed, using fallback:', result.error);
                // toast.error("AI 해석에 실패하여 기본 해석을 표시합니다.");
            }

            // 2. Save Session to Database
            if (finalInterpretation) {
                const saveResult = await saveTarotSession({
                    question,
                    cards: drawnCards,
                    spreadType: selectedSpread,
                    interpretation: finalInterpretation,
                    clientId: clientId || undefined // Pass optional clientId
                });

                if (saveResult.success) {
                    console.log("Session saved successfully:", saveResult.sessionId);
                    // toast.success("타로 리딩이 저장되었습니다.");
                } else {
                    console.error("Failed to save session:", saveResult.error);
                    // toast.error("세션 저장에 실패했습니다.");
                }
            }

            setStep("result");
        } catch (error) {
            console.error('Failed to get interpretation:', error);

            // Emergency fallback
            const cardSummary = drawnCards.map(c =>
                `${c.name_kr} (${c.position_meaning}, ${c.is_reversed ? '역방향' : '정방향'})`
            ).join(', ');

            setInterpretation(
                `질문: "${question}"\n\n` +
                `뽑힌 카드: ${cardSummary}\n\n` +
                `현재 AI 해석을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.`
            );
            setStep("result");
        } finally {
            setIsProcessing(false);
        }
    };

    const spreadOptions: { type: SpreadType; label: string; description: string }[] = [
        { type: "1-card", label: "1장 스프레드", description: "현재 상황에 대한 즉각적인 통찰" },
        { type: "3-card", label: "3장 스프레드", description: "과거-현재-미래의 흐름" },
        { type: "celtic-cross", label: "켈틱 크로스", description: "심층 분석 (10장)" }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[var(--color-soft-gold)] mx-auto" />
                    <p className="text-slate-400">타로 덱을 준비하는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] pb-20">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-slate-400 hover:text-[var(--color-soft-gold)] transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">대시보드</span>
                    </Link>
                    <h1 className="text-lg font-serif text-[var(--color-soft-gold)]">타로 리딩</h1>
                    <div className="w-24" /> {/* Spacer for centering */}
                </div>
            </header>

            {/* Progress Indicator */}
            <div className="fixed top-20 left-0 w-full flex justify-center gap-2 z-40 pointer-events-none">
                {["intention", "spread-select", "shuffle", "draw", "reveal", "result"].map((s, i) => (
                    <div
                        key={s}
                        className={`h-1 w-12 rounded-full transition-all duration-500 ${["intention", "spread-select", "shuffle", "draw", "reveal", "result"].indexOf(step) >= i
                            ? "bg-[var(--color-soft-gold)] shadow-[0_0_10px_var(--color-soft-gold)]"
                            : "bg-white/10"
                            }`}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12">
                {/* Step 1: Intention Setting */}
                {step === "intention" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto space-y-8 mt-[10vh]"
                    >
                        <div className="text-center space-y-6">
                            <div className="w-24 h-24 bg-[var(--color-soft-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-12 h-12 text-[var(--color-soft-gold)]" />
                            </div>
                            <h2 className="text-4xl font-serif text-[var(--color-foreground)] leading-tight">
                                무엇이 궁금하신가요?
                            </h2>
                            <p className="text-slate-400 text-lg">
                                마음속 깊은 고민을 타로에게 물어보세요.<br />
                                당신의 무의식이 답을 알고 있습니다.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="예: 내 진로에 대해 조언을 구합니다"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl text-[var(--color-foreground)] placeholder:text-slate-600 focus:outline-none focus:border-[var(--color-soft-gold)] focus:bg-white/10 transition-all text-center"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && question.trim()) {
                                        setStep("spread-select");
                                    }
                                }}
                            />
                            <button
                                onClick={() => setStep("spread-select")}
                                disabled={!question.trim()}
                                className="w-full bg-[var(--color-midnight-green)] hover:bg-emerald-900 disabled:bg-slate-800 disabled:text-slate-600 text-emerald-100 border border-emerald-500/30 disabled:border-slate-700 font-bold py-5 rounded-xl flex items-center justify-center gap-2 transition-all text-lg shadow-lg shadow-emerald-900/20"
                            >
                                <span>다음 단계로</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Spread Selection */}
                {step === "spread-select" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto space-y-12 mt-[5vh]"
                    >
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-serif text-[var(--color-foreground)]">
                                스프레드를 선택하세요
                            </h2>
                            <p className="text-slate-400">
                                질문의 깊이에 따라 적절한 카드 배열법을 선택해주세요
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {spreadOptions.map((option) => (
                                <button
                                    key={option.type}
                                    onClick={() => {
                                        setSelectedSpread(option.type);
                                        setStep("shuffle");
                                    }}
                                    className={`relative p-8 rounded-3xl border-2 transition-all text-left hover:scale-[1.02] active:scale-[0.98] ${selectedSpread === option.type
                                        ? "border-[var(--color-soft-gold)] bg-[var(--color-soft-gold)]/10 shadow-[0_0_30px_rgba(250,219,109,0.1)]"
                                        : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                        }`}
                                >
                                    <div className="absolute top-6 right-6 opacity-20">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-3">
                                        {option.label}
                                    </h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Shuffling */}
                {step === "shuffle" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto text-center space-y-12 mt-[15vh]"
                    >
                        <div className="space-y-4">
                            <h2 className="text-4xl font-serif text-[var(--color-foreground)]">
                                카드를 섞어주세요
                            </h2>
                            <p className="text-slate-400 text-lg">
                                마음을 차분히 가라앉히고 질문에 집중하세요.<br />
                                준비가 되면 아래 버튼을 눌러주세요.
                            </p>
                        </div>

                        <button
                            onClick={handleShuffle}
                            disabled={isShuffling}
                            className="group relative mx-auto"
                        >
                            <div className="absolute inset-0 bg-[var(--color-soft-gold)] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-[var(--color-soft-gold)] hover:bg-yellow-500 disabled:bg-slate-700 text-[var(--color-midnight-blue)] disabled:text-slate-500 font-bold py-8 px-16 rounded-2xl flex items-center gap-4 transition-all shadow-xl">
                                <Shuffle className={`w-8 h-8 ${isShuffling ? 'animate-spin' : ''}`} />
                                <span className="text-xl">{isShuffling ? '운명을 섞는 중...' : '카드 섞기'}</span>
                            </div>
                        </button>
                    </motion.div>
                )}

                {/* Step 4: Drawing */}
                {step === "draw" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-2xl mx-auto text-center space-y-12 mt-[15vh]"
                    >
                        <div className="space-y-4">
                            <h2 className="text-4xl font-serif text-[var(--color-foreground)]">
                                카드를 선택하세요
                            </h2>
                            <p className="text-slate-400 text-lg">
                                직관이 이끄는 카드를 선택해주세요.<br />
                                <span className="text-[var(--color-soft-gold)] font-bold">
                                    {selectedSpread === "1-card" && "1장"}
                                    {selectedSpread === "3-card" && "3장"}
                                    {selectedSpread === "celtic-cross" && "10장"}
                                </span>
                                의 카드가 필요합니다.
                            </p>
                        </div>

                        <button
                            onClick={handleDraw}
                            className="bg-transparent hover:bg-white/5 border-2 border-[var(--color-soft-gold)] text-[var(--color-soft-gold)] font-bold py-6 px-12 rounded-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            카드 뽑기 (Click)
                        </button>

                        <p className="text-xs text-slate-600">
                            * 실제로는 덱 전체가 펼쳐진 UI가 표시되며,<br />
                            사용자가 직접 클릭하여 뽑는 인터랙션이 들어갈 예정입니다.
                        </p>
                    </motion.div>
                )}

                {/* Step 5 & 6: Reveal & Result */}
                {(step === "reveal" || step === "result") && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                        {/* Left: Drawn Cards */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-serif text-[var(--color-soft-gold)] mb-2">
                                    당신의 카드
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    선택하신 카드가 운명의 이야기를 들려줍니다.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {drawnCards.map((card, index) => (
                                    <div key={index} className="flex flex-col items-center space-y-4">
                                        <div className="text-center space-y-1">
                                            <p className="text-xs text-[var(--color-soft-gold)] uppercase tracking-wide font-bold">
                                                {card.position_meaning}
                                            </p>
                                        </div>

                                        <TarotCard
                                            cardNameEn={card.name_en}
                                            cardNameKr={card.name_kr}
                                            isRevealed={true}
                                            isReversed={card.is_reversed}
                                            size="lg"
                                            className="mx-auto shadow-2xl"
                                        />

                                        <div className="text-center px-2">
                                            <span className="text-white font-serif text-lg font-bold drop-shadow-md">
                                                {card.name_kr}
                                            </span>
                                            {card.is_reversed && (
                                                <p className="text-xs text-red-400 font-bold mt-1">역방향</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {step === "reveal" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="pt-8"
                                >
                                    <button
                                        onClick={handleInterpret}
                                        disabled={isProcessing}
                                        className="w-full bg-[var(--color-soft-gold)] hover:bg-yellow-600 disabled:bg-slate-700 text-[var(--color-midnight-blue)] disabled:text-slate-500 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-900/20 disabled:shadow-none text-lg"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>AI가 카드를 해석하고 있습니다... (약 15초)</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-6 h-6" />
                                                <span>AI 해석 듣기</span>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-slate-500 text-sm mt-4">
                                        GPT-4o가 30년 경력의 타로 리더 페르소나로 해석해드립니다.
                                    </p>
                                </motion.div>
                            )}

                            {step === "result" && interpretation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 space-y-6 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-soft-gold)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                    <div className="flex items-center gap-3 border-b border-white/10 pb-6 mb-6">
                                        <Sparkles className="w-6 h-6 text-[var(--color-soft-gold)]" />
                                        <h3 className="text-2xl font-serif text-[var(--color-soft-gold)]">
                                            AI 타로 해석
                                        </h3>
                                    </div>

                                    <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
                                        {interpretation}
                                    </div>

                                    <div className="pt-8 flex justify-center">
                                        <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-2 transition-colors">
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>대시보드로 돌아가기</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right: Digital Scribe */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <DigitalScribe drawnCards={drawnCards} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function TarotSessionPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--color-soft-gold)]" />
            </div>
        }>
            <TarotSessionContent />
        </Suspense>
    );
}
