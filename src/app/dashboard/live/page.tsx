"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LiveSessionPage() {
    const router = useRouter();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setDuration(d => d + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        // In a real app, this would trigger session summary/feedback
        if (confirm("상담을 종료하시겠습니까?")) {
            router.push("/dashboard");
        }
    };

    return (
        <div className="fixed inset-0 bg-zinc-900 flex flex-col z-[100]">
            {/* Header Info */}
            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white font-mono text-sm tracking-widest">{formatTime(duration)}</span>
                    <span className="text-white/50 text-sm">|</span>
                    <span className="text-white/80 text-sm">심리 상담 세션 #2024-001</span>
                </div>
                <div className="bg-black/40 backdrop-blur px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/60">설정</span>
                </div>
            </div>

            {/* Main Video Area (Counselor) */}
            <div className="flex-1 relative bg-slate-800 flex items-center justify-center overflow-hidden">
                {/* Background blurred or styled */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#0f172a_100%)]" />

                <div className="relative z-0 text-center space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600">
                        <User className="w-16 h-16 text-slate-400" />
                    </div>
                    <h2 className="text-2xl text-slate-200 font-medium">김서연 상담사</h2>
                    <p className="text-slate-400">연결 상태 양호</p>
                </div>

                {/* User Self-View (PIP) */}
                <motion.div
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Simplified for demo
                    className="absolute bottom-24 right-6 w-36 h-48 bg-black/50 backdrop-blur border border-white/20 rounded-xl overflow-hidden shadow-2xl z-20 cursor-move"
                >
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        {isVideoOff ? (
                            <User className="w-8 h-8 text-zinc-500" />
                        ) : (
                            <div className="text-xs text-zinc-500">[Camera Feed]</div>
                        )}
                    </div>
                    <div className="absolute bottom-2 left-2 text-[10px] text-white/80 px-1 bg-black/40 rounded">나</div>
                </motion.div>
            </div>

            {/* Control Bar */}
            <div className="h-20 bg-zinc-900 border-t border-white/5 flex items-center justify-center gap-6 relative z-30 safe-area-bottom">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full transition-all ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-4 rounded-full transition-all ${isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </button>

                <button
                    onClick={handleEndCall}
                    className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/40 px-8"
                >
                    <PhoneOff className="w-6 h-6" />
                </button>

                <button className="p-4 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all">
                    <MessageSquare className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
