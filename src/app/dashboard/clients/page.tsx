'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Users, Search, ArrowLeft, Loader2, UserPlus, X, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'

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

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Form state
    const [nickname, setNickname] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [age, setAge] = useState('')
    const [gender, setGender] = useState('')
    const [region, setRegion] = useState('')
    const [memo, setMemo] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('counselor_id', user.id)
            .or('status.neq.Archived,status.is.null')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching clients:', error)
        } else {
            setClients(data || [])
        }
        setLoading(false)
    }

    const handleAddClient = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('clients')
            .insert([
                {
                    nickname,
                    phone,
                    email,
                    age: age ? parseInt(age) : null,
                    gender,
                    region,
                    memo,
                    counselor_id: user.id
                }
            ])

        if (error) {
            alert(error.message)
        } else {
            setIsModalOpen(false)
            setNickname('')
            setPhone('')
            setEmail('')
            setAge('')
            setGender('')
            setRegion('')
            setMemo('')
            fetchClients()
        }
        setSubmitting(false)
    }

    const filteredClients = clients.filter(client =>
        client.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
            {/* Header */}
            <header className="bg-white/80 border-b border-[#FDF2E9] backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-[#4A443F] hover:text-[var(--color-midnight-blue)] transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-bold text-[var(--color-midnight-blue)] tracking-tight">내담자 관리</h1>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[var(--color-soft-gold)] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[var(--color-soft-gold)]/90 transition-all active:scale-95 shadow-sm"
                    >
                        <Plus size={18} />
                        추가하기
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-soft-gold)]" size={20} />
                    <input
                        type="text"
                        placeholder="내담자 이름(닉네임) 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl py-3 pl-12 pr-4 text-[#4A443F] placeholder:text-[#4A443F]/40 focus:outline-none focus:border-[var(--color-soft-gold)] focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all shadow-sm"
                    />
                </div>

                {/* Clients List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white border border-[#FDF2E9] rounded-2xl p-6 h-[220px] flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <Skeleton className="w-12 h-12 rounded-xl bg-slate-100" />
                                        <Skeleton className="w-20 h-4 bg-slate-100" />
                                    </div>
                                    <Skeleton className="w-1/2 h-6 bg-slate-100 mb-3" />
                                    <div className="space-y-2">
                                        <Skeleton className="w-2/3 h-4 bg-slate-100" />
                                        <Skeleton className="w-3/4 h-4 bg-slate-100" />
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Skeleton className="w-12 h-5 bg-slate-100 rounded" />
                                    <Skeleton className="w-12 h-5 bg-slate-100 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredClients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClients.map((client) => (
                            <Link href={`/dashboard/clients/${client.id}`} key={client.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white border border-[#FDF2E9] rounded-2xl p-6 hover:border-[var(--color-soft-gold)] hover:shadow-md transition-all group cursor-pointer h-full shadow-sm"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#FDF2E9] flex items-center justify-center text-[#4A443F] font-bold text-xl shadow-inner">
                                            {client.nickname[0]}
                                        </div>
                                        <div className="text-[10px] uppercase tracking-widest text-[#4A443F]/50 font-medium mt-1">
                                            {new Date(client.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--color-midnight-blue)] group-hover:text-[var(--color-soft-gold)] transition-colors">{client.nickname}</h3>
                                    <div className="space-y-0.5 mt-1">
                                        <p className="text-sm text-[#4A443F]/80 font-medium">{client.phone}</p>
                                        <p className="text-sm text-[#4A443F]/80 font-medium">{client.email}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {client.age && (
                                            <span className="text-xs px-2.5 py-1 rounded bg-[#FDFBF7] border border-[#FDF2E9] text-[#4A443F]/80 font-bold">
                                                {client.age}세
                                            </span>
                                        )}
                                        {client.gender && (
                                            <span className="text-xs px-2.5 py-1 rounded bg-[#FDFBF7] border border-[#FDF2E9] text-[#4A443F]/80 font-bold">
                                                {client.gender}
                                            </span>
                                        )}
                                        {client.region && (
                                            <span className="text-xs px-2.5 py-1 rounded bg-[#FDFBF7] border border-[#FDF2E9] text-[#4A443F]/80 font-bold">
                                                {client.region}
                                            </span>
                                        )}
                                    </div>
                                    {client.memo && (
                                        <p className="text-sm text-[#4A443F]/60 mt-4 line-clamp-2 italic leading-relaxed">"{client.memo}"</p>
                                    )}
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
                        <div className="bg-[#FDF2E9] p-8 rounded-full border border-[var(--color-soft-gold)]/20 shadow-inner">
                            <Users className="text-[var(--color-soft-gold)]" size={64} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-[var(--color-midnight-blue)]">등록된 내담자가 없습니다</p>
                            <p className="text-[#4A443F]/80 mt-2 font-medium">새로운 내담자를 등록하여 상담을 기록해 보세요.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white border-2 border-[var(--color-soft-gold)] text-[var(--color-soft-gold)] px-8 py-3 rounded-xl font-bold hover:bg-[var(--color-soft-gold)] hover:text-white transition-all active:scale-95 shadow-sm"
                        >
                            첫 내담자 등록하기
                        </button>
                    </div>
                )}
            </main>

            {/* Registration Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg max-h-[85vh] bg-card border border-card-border rounded-3xl shadow-2xl overflow-y-auto"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-[#FDF2E9] p-2 rounded-lg text-[var(--color-soft-gold)]">
                                            <UserPlus size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-[var(--color-midnight-blue)]">내담자 등록</h2>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="text-[#4A443F]/50 hover:text-[var(--color-soft-gold)]">
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Smart Intake Warning */}
                                <div className="mb-6 bg-[#FDFBF7] border border-[#FDF2E9] p-4 rounded-xl flex items-center gap-3 shadow-inner">
                                    <ShieldAlert className="w-6 h-6 text-[var(--color-soft-gold)] shrink-0" />
                                    <p className="text-sm font-medium text-[#4A443F]">
                                        개인정보 보호를 위해 실명 대신 <strong>닉네임/애칭</strong>을 사용하세요.
                                    </p>
                                </div>

                                <form onSubmit={handleAddClient} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#4A443F] ml-1">닉네임 (애칭) *</label>
                                        <input
                                            required
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            placeholder="예: 별님, 하늘 (가명 권장)"
                                            className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl py-4 px-4 text-[#4A443F] focus:outline-none focus:border-[var(--color-soft-gold)] focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all placeholder:text-[#4A443F]/30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#4A443F] ml-1">전화번호 *</label>
                                        <input
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="010-0000-0000"
                                            className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl py-4 px-4 text-[#4A443F] focus:outline-none focus:border-[var(--color-soft-gold)] focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all placeholder:text-[#4A443F]/30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#4A443F] ml-1">이메일 *</label>
                                        <input
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="sample@email.com"
                                            className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl py-4 px-4 text-[#4A443F] focus:outline-none focus:border-[var(--color-soft-gold)] focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all placeholder:text-[#4A443F]/30"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#4A443F] ml-1">나이 (선택)</label>
                                            <input
                                                type="number"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                placeholder="예: 30"
                                                className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl py-4 px-4 text-[#4A443F] focus:outline-none focus:border-[var(--color-soft-gold)] focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all placeholder:text-[#4A443F]/30"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-[#4A443F] ml-1">성별 (선택)</label>
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl py-4 px-4 text-[#4A443F] focus:outline-none focus:border-[var(--color-soft-gold)] focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all appearance-none"
                                            >
                                                <option value="">선택 안함</option>
                                                <option value="남성">남성</option>
                                                <option value="여성">여성</option>
                                                <option value="기타">기타</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#4A443F] ml-1">지역 (선택)</label>
                                        <input
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            placeholder="예: 서울, 부산"
                                            className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl py-4 px-4 text-[#4A443F] focus:outline-none focus:border-[var(--color-soft-gold)] focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all placeholder:text-[#4A443F]/30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#4A443F] ml-1">상담 메모 (선택)</label>
                                        <textarea
                                            value={memo}
                                            onChange={(e) => setMemo(e.target.value)}
                                            placeholder="내담자에 대한 간단한 특징을 적어주세요."
                                            rows={3}
                                            className="w-full bg-[#FDFBF7] border border-[#FDF2E9] rounded-xl py-4 px-4 text-[#4A443F] focus:outline-none focus:border-[var(--color-soft-gold)] focus:ring-1 focus:ring-[var(--color-soft-gold)] transition-all resize-none placeholder:text-[#4A443F]/30"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-[var(--color-soft-gold)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-soft-gold)]/90 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                                        등록 완료
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
