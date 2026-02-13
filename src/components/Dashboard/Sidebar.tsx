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
        <aside className="hidden md:flex flex-col w-64 h-screen bg-midnight border-r border-white/5 fixed left-0 top-0 z-50">
            <div className="p-8">
                <h1 className="text-2xl font-serif text-gold tracking-tight">
                    SolevoLog
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
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-white/5 text-gold border border-gold/20"
                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-gold" : "text-slate-500 group-hover:text-slate-300")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="px-4 py-3">
                    <LogoutButton />
                </div>
            </div>
        </aside>
    );
}
