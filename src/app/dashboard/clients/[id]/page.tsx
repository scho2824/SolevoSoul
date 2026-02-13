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

    const handleDelete = async () => {
        if (!confirm('정말로 이 내담자를 삭제하시겠습니까? 관련된 모든 상담 기록이 영구적으로 삭제될 수 있습니다.')) return

        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id)

            if (error) throw error

            toast.success('내담자가 삭제되었습니다.')
            router.push('/dashboard/clients')
        } catch (error: any) {
            toast.error(`삭제 중 오류가 발생했습니다: ${error.message}`)
        }
    }

    if (loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-gold">데이터를 불러오는 중...</div>
    }

    if (!client) return null

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Header */}
            <header className="bg-background/80 border-b border-card-border backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/clients" className="text-slate-400 hover:text-gold transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-gold tracking-tight">{isEditing ? '내담자 정보 수정' : client.nickname}</h1>
                    </div>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={saving}
                                    className="bg-gold text-midnight px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gold/90 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    저장
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-card border border-gold/30 text-gold px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gold hover:text-midnight transition-all active:scale-95"
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
                <section className="bg-card border border-card-border rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <UserIconLarge />
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gold uppercase tracking-widest mb-1.5 block">닉네임</label>
                                {isEditing ? (
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-lg font-bold focus:border-gold outline-none text-white"
                                        value={formData.nickname}
                                        onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                                    />
                                ) : (
                                    <div className="text-3xl font-bold text-white">{client.nickname}</div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">나이</label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold outline-none text-white"
                                            value={formData.age || ''}
                                            onChange={e => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : null })}
                                        />
                                    ) : (
                                        <div className="text-lg text-slate-300">{client.age ? `${client.age}세` : '-'}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">성별</label>
                                    {isEditing ? (
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold outline-none text-white"
                                            value={formData.gender || ''}
                                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                        >
                                            <option value="">선택 안함</option>
                                            <option value="남성">남성</option>
                                            <option value="여성">여성</option>
                                            <option value="기타">기타</option>
                                        </select>
                                    ) : (
                                        <div className="text-lg text-slate-300">{client.gender || '-'}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Contact & Memo */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="text-gold w-5 h-5" />
                                    {isEditing ? (
                                        <input
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 focus:border-gold outline-none text-white"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-slate-300">{client.phone}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="text-gold w-5 h-5" />
                                    {isEditing ? (
                                        <input
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 focus:border-gold outline-none text-white"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    ) : (
                                        <span className="text-slate-300">{client.email}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-gold w-5 h-5" />
                                    {isEditing ? (
                                        <input
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 focus:border-gold outline-none text-white"
                                            value={formData.region || ''}
                                            onChange={e => setFormData({ ...formData, region: e.target.value })}
                                            placeholder="지역 입력"
                                        />
                                    ) : (
                                        <span className="text-slate-300">{client.region || '지역 미입력'}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">상담 메모</label>
                                {isEditing ? (
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-gold outline-none text-white resize-none"
                                        rows={3}
                                        value={formData.memo || ''}
                                        onChange={e => setFormData({ ...formData, memo: e.target.value })}
                                    />
                                ) : (
                                    <div className="bg-midnight/30 p-4 rounded-xl border border-white/5 text-slate-300 italic min-h-[80px]">
                                        {client.memo || '메모가 없습니다.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                            <button
                                onClick={handleDelete}
                                className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Archive size={16} />
                                내담자 삭제 (복구 불가)
                            </button>
                        </div>
                    )}
                </section>

                {/* Session History Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Calendar className="text-gold" />
                            상담 기록
                        </h2>
                        <div className="flex gap-4 items-center">
                            <Link href={`/session/tarot?clientId=${id}`} className="text-sm text-purple-400 hover:text-purple-300 hover:underline flex items-center gap-1 transition-colors">
                                <Sparkles size={14} />
                                타로 상담 시작
                            </Link>
                            <Link href="/dashboard/sessions/new" className="text-sm text-gold hover:underline">
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
                                        className="bg-card border border-card-border rounded-xl p-6 hover:border-gold/50 transition-all cursor-pointer group flex items-center justify-between"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gold font-bold text-lg">
                                                    {new Date(session.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-slate-500 text-sm flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h3 className="text-white font-medium group-hover:text-gold transition-colors">
                                                {session.tarot_question || '질문 없음'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {/* Risk Flag Indicator */}
                                            {session.risk_flags && session.risk_flags.length > 0 && (
                                                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
                                                    RISK DETECTED
                                                </span>
                                            )}
                                            <ChevronRight className="text-slate-600 group-hover:text-gold transition-colors" />
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-card border border-card-border rounded-xl border-dashed">
                            <FileText className="mx-auto text-slate-500 mb-4" size={40} />
                            <p className="text-slate-400">아직 상담 기록이 없습니다.</p>
                            <Link href="/dashboard/sessions/new">
                                <button className="mt-4 text-gold hover:underline font-bold">
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
