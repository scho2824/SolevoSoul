"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "홈", icon: Home },
    { href: "/dashboard/sessions", label: "기록", icon: History },
    { href: "/dashboard/clients", label: "내담자", icon: Users },
    { href: "/dashboard/profile", label: "MY", icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--color-midnight-blue)]/90 backdrop-blur-lg border-t border-white/5 z-50 flex items-center justify-around px-2 safe-area-bottom">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                            isActive ? "text-[var(--color-soft-gold)]" : "text-slate-500"
                        )}
                    >
                        <item.icon className={cn("w-6 h-6", isActive && "fill-current/20")} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
