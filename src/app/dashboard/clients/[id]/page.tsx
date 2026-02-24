'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Edit2, Archive, Phone, Mail, MapPin, FileText, Calendar, Clock, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface Client {
    id: string
    nickname: string
    phone: string
    email: string
    age: number | null
    gender: string | null
    region: string | null
    memo: string | null
    created_at: string
}

interface Session {
    id: string
    created_at: string
    tarot_question: string
    risk_flags?: string[] | null
    sentiment_score?: number | null
}

export default function ClientDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const supabase = createClient()

    const [client, setClient] = useState<Client | null>(null)
    const [sessions, setSessions] = useState<Session[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)

    // Edit Form State
    const [formData, setFormData] = useState<Partial<Client>>({})

    useEffect(() => {
        if (id) fetchData()
    }, [id])

    const fetchData = async () => {
        setLoading(true)
        try {
            // Fetch Client
            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single()

            if (clientError) throw clientError
            setClient(clientData)
            setFormData(clientData)

            // Fetch Sessions
            const { data: sessionData, error: sessionError } = await supabase
                .from('sessions')
                .select('id, created_at, tarot_question')
                .eq('client_id', id)
                .order('created_at', { ascending: false })

            if (sessionError) throw sessionError
            setSessions(sessionData || [])

        } catch (error: any) {
            toast.error(`데이터를 불러오는데 실패했습니다: ${error.message}`)
            router.push('/dashboard/clients')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        setSaving(true)
        try {
            const { error } = await supabase
                .from('clients')
                .update({
                    nickname: formData.nickname,
                    phone: formData.phone,
                    email: formData.email,
                    age: formData.age,
                    gender: formData.gender,
                    region: formData.region,
                    memo: formData.memo
                })
                .eq('id', id)

            if (error) throw error

            toast.success('내담자 정보가 수정되었습니다.')
            setClient({ ...client, ...formData } as Client)
            setIsEditing(false)
        } catch (error: any) {
            toast.error(`수정 중 오류가 발생했습니다: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    const handleArchive = async () => {
        if (!confirm('이 내담자를 보관(목록 숨김) 처리하시겠습니까? (기록은 안전하게 보존됩니다)')) return

        try {
            const { error } = await supabase
                .from('clients')
                .update({ status: 'Archived' })
                .eq('id', id)

            if (error) throw error

            toast.success('내담자가 보관 처리되어 목록에서 숨겨졌습니다.')
            router.push('/dashboard/clients')
        } catch (error: any) {
            toast.error(`보관 처리 중 오류가 발생했습니다: ${error.message}`)
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-gold">데이터를 불러오는 중...</div>
    }

    if (!client) return null

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
            {/* Header */}
            <header className="bg-white/80 border-b border-[#FDF2E9] backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/clients" className="text-[#4A443F] hover:text-[var(--color-midnight-blue)] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-[var(--color-midnight-blue)] tracking-tight">{isEditing ? '내담자 정보 수정' : client.nickname}</h1>
                    </div>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded-lg text-[#4A443F]/60 hover:text-[#4A443F] transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="bg-[var(--color-soft-gold)] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[var(--color-soft-gold)]/90 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                                >
                                    <Save size={18} />
                                    저장
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-white border-2 border-[var(--color-soft-gold)] text-[var(--color-soft-gold)] px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[var(--color-soft-gold)] hover:text-white transition-all active:scale-95 shadow-sm"
                            >
                                <Edit2 size={18} />
                                수정
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8">
                {/* Profile Section */}
                <section className="bg-white border border-[#FDF2E9] rounded-2xl p-8 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 p-4 shrink-0 pointer-events-none text-[#FDF2E9] scale-150 origin-top-right">
                        <UserIconLarge />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-[var(--color-soft-gold)] uppercase tracking-widest mb-1.5 block">닉네임</label>
                                {isEditing ? (
                                    <input
                                        className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl p-3 text-lg font-bold text-[#4A443F] focus:border-[var(--color-soft-gold)] outline-none focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all"
                                        value={formData.nickname}
                                        onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                    />
                                ) : (
                                    <div className="text-3xl font-bold text-[var(--color-midnight-blue)]">{client.nickname}</div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-[#4A443F]/60 uppercase tracking-widest mb-1.5 block">나이</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl p-3 text-[#4A443F] focus:border-[var(--color-soft-gold)] outline-none focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all"
                                            value={formData.age || ''}
                                            onChange={e => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : null })}
                                        />
                                    ) : (
                                        <div className="text-lg font-medium text-[#4A443F]/80">{client.age ? `${client.age}세` : '-'}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#4A443F]/60 uppercase tracking-widest mb-1.5 block">성별</label>
                                    {isEditing ? (
                                        <select
                                            className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl p-3 text-[#4A443F] focus:border-[var(--color-soft-gold)] outline-none focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all appearance-none"
                                            value={formData.gender || ''}
                                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="">선택 안함</option>
                                            <option value="남성">남성</option>
                                            <option value="여성">여성</option>
                                            <option value="기타">기타</option>
                                        </select>
                                    ) : (
                                        <div className="text-lg font-medium text-[#4A443F]/80">{client.gender || '-'}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Contact & Memo */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="text-[var(--color-soft-gold)] w-5 h-5 shrink-0" />
                                    {isEditing ? (
                                        <input
                                            className="flex-1 bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl p-3 text-[#4A443F] focus:border-[var(--color-soft-gold)] outline-none focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-[#4A443F]/80 font-medium">{client.phone}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="text-[var(--color-soft-gold)] w-5 h-5 shrink-0" />
                                    {isEditing ? (
                                        <input
                                            className="flex-1 bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl p-3 text-[#4A443F] focus:border-[var(--color-soft-gold)] outline-none focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-[#4A443F]/80 font-medium">{client.email}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-[var(--color-soft-gold)] w-5 h-5 shrink-0" />
                                    {isEditing ? (
                                        <input
                                            className="flex-1 bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl p-3 text-[#4A443F] focus:border-[var(--color-soft-gold)] outline-none focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all"
                                            value={formData.region || ''}
                                            onChange={e => setFormData({ ...formData, region: e.target.value })}
                                            placeholder="지역 입력"
                                        />
                                    ) : (
                                        <span className="text-[#4A443F]/80 font-medium">{client.region || '지역 미입력'}</span>
                                    )}
                                </div>
                            </div>

                            <div className="relative z-20">
                                <label className="text-xs font-bold text-[var(--color-midnight-blue)]/60 uppercase tracking-widest mb-1.5 block">상담 메모</label>
                                {isEditing ? (
                                    <textarea
                                        className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl p-3 text-[#4A443F] focus:border-[var(--color-soft-gold)] outline-none focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all resize-none"
                                        rows={3}
                                        value={formData.memo || ''}
                                        onChange={e => setFormData({ ...formData, memo: e.target.value })}
                                    />
                                ) : (
                                    <div className="bg-[#B9B3A9] p-4 rounded-xl text-white italic min-h-[80px] font-medium shadow-inner backdrop-blur-sm relative z-20 overflow-hidden">
                                        {client.memo || '메모가 없습니다.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 pt-8 border-t border-[#FDF2E9] flex justify-end">
                            <button
                                onClick={handleArchive}
                                className="text-[#4A443F]/60 hover:text-[var(--color-midnight-blue)] flex items-center gap-2 text-sm font-bold px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                            >
                                <Archive size={16} />
                                내담자 보관 (목록 숨김)
                            </button>
                        </div>
                    )}
                </section>

                {/* Session History Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[var(--color-midnight-blue)] flex items-center gap-2">
                            <Calendar className="text-[var(--color-soft-gold)]" />
                            상담 기록
                        </h2>
                        <div className="flex gap-4 items-center">
                            <Link href={`/session/tarot?clientId=${id}`} className="text-sm font-bold text-[#b498e5] hover:text-[#9b76de] flex items-center gap-1 transition-colors">
                                <Sparkles size={14} />
                                타로 상담 시작
                            </Link>
                            <Link href={`/dashboard/sessions/new?clientId=${id}`} className="text-sm font-bold text-[var(--color-soft-gold)] hover:text-[var(--color-midnight-blue)] transition-colors">
                                + 새 상담 기록하기
                            </Link>
                        </div>
                    </div>

                    {sessions.length > 0 ? (
                        <div className="space-y-4">
                            {sessions.map(session => (
                                <Link href={`/dashboard/sessions/${session.id}`} key={session.id}>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="bg-white border border-[#FDF2E9] rounded-xl p-6 hover:border-[var(--color-soft-gold)] hover:shadow-md transition-all cursor-pointer group flex items-center justify-between shadow-sm"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 text-lg font-bold">
                                                <span className="text-[var(--color-soft-gold)]">
                                                    {new Date(session.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-[#4A443F]/50 text-sm flex items-center gap-1 font-medium bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#FDF2E9]">
                                                    <Clock size={12} />
                                                    {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h3 className="text-[var(--color-midnight-blue)] font-bold group-hover:text-[var(--color-soft-gold)] transition-colors mt-2 text-lg">
                                                {session.tarot_question || '질문 없음'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {/* Risk Flag Indicator */}
                                            {session.risk_flags && session.risk_flags.length > 0 && (
                                                <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                                                    RISK DETECTED
                                                </span>
                                            )}
                                            <ChevronRight className="text-[#4A443F]/30 group-hover:text-[var(--color-soft-gold)] transition-colors" />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white border border-[#FDF2E9] rounded-xl border-dashed">
                            <FileText className="mx-auto text-[#4A443F]/20 mb-4" size={40} />
                            <p className="text-[#4A443F]/60 font-medium font-bold">아직 상담 기록이 없습니다.</p>
                            <Link href={`/dashboard/sessions/new?clientId=${id}`}>
                                <button className="mt-4 text-[var(--color-soft-gold)] hover:text-[var(--color-midnight-blue)] font-bold transition-colors">
                                    첫 상담 시작하기
                                </button>
                            </Link>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

function UserIconLarge() {
    return (
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )
}
