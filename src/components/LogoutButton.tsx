'use client'

import { createClient } from '@/utils/supabase/client'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Error signing out:', error.message)
        } else {
            router.push('/login')
            router.refresh()
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-lavender/40 hover:text-gold transition-colors"
        >
            <LogOut size={16} />
            로그아웃
        </button>
    )
}
