"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/LogoutButton";

const navItems = [
    { href: "/dashboard", label: "홈", icon: Home },
    { href: "/dashboard/sessions", label: "상담 기록", icon: History },
    { href: "/dashboard/profile", label: "프로필", icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen bg-[var(--background)] border-r border-[#FDF2E9] fixed left-0 top-0 z-50 shadow-sm">
            <div className="p-8">
                <h1 className="text-3xl font-serif text-[var(--color-midnight-blue)] font-bold tracking-tight">
                    Solevo Log
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-bold",
                                isActive
                                    ? "bg-[var(--color-midnight-blue)] text-white shadow-md"
                                    : "text-[#4A443F] hover:bg-orange-50 hover:text-[var(--color-midnight-blue)]"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-[var(--color-soft-gold)]" : "text-[#4A443F]/60 group-hover:text-[var(--color-midnight-blue)]")} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#FDF2E9]">
                <div className="px-4 py-3 flex justify-center">
                    <LogoutButton />
                </div>
            </div>
        </aside>
    );
}
