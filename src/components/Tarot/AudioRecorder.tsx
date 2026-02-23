"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, RefreshCw, MicOff } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { transcribeAudio } from "@/app/actions/stt";

interface AudioRecorderProps {
    sessionId: string;
    onTranscriptionComplete: (text: string) => void;
}

export default function AudioRecorder({ sessionId, onTranscriptionComplete }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [volume, setVolume] = useState<number[]>(new Array(20).fill(10)); // For waveform visualization
    const [micError, setMicError] = useState(false);

    const supabase = createClient();

    const startRecording = async () => {
        try {
            setMicError(false);
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks: BlobPart[] = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: "audio/webm" });
                setAudioBlob(blob);
                handleUploadAndTranscribe(blob);
            };

            // Audio Context for Waveform
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyzer = audioContext.createAnalyser();
            source.connect(analyzer);
            analyzer.fftSize = 64;
            const dataArray = new Uint8Array(analyzer.frequencyBinCount);

            const updateVolume = () => {
                if (!isRecording) return;
                analyzer.getByteFrequencyData(dataArray);
                // Create a simplified volume array for the visualizer
                const newVolume = Array.from(dataArray).slice(0, 20).map(v => Math.max(10, v / 2));
                setVolume(newVolume);
                requestAnimationFrame(updateVolume);
            };

            mediaRecorder.start();
            setIsRecording(true);

            // Start visualization loop (simplified) - usually needs to be hooked deeper, but for MVP:
            // updateVolume(); // This needs to be managed carefully with React state updates to avoid lag
            // Check performance, maybe use CSS animation for MVP "fake" waveform if real one is too heavy

            timerRef.current = setInterval(() => {
                setDuration((prev) => prev + 1);
                // Fake waveform for MVP performance
                setVolume(prev => prev.map(() => Math.random() * 40 + 10));
            }, 100);

        } catch (err) {
            console.error("Failed to start recording", err);
            setMicError(true);
            toast.error("마이크 권한이 거부되었거나 장치를 찾을 수 없습니다.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);

            // Stop all tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleUploadAndTranscribe = async (blob: Blob) => {
        setIsProcessing(true);
        try {
            // 1. Upload to Supabase Storage
            const filename = `session_${sessionId}_${Date.now()}.webm`;
            const { data, error } = await supabase.storage
                .from('session-audio')
                .upload(`${sessionId}/${filename}`, blob);

            if (error) throw error;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('session-audio')
                .getPublicUrl(`${sessionId}/${filename}`);

            // 3. Call Server Action for Clova STT
            const transcript = await transcribeAudio(sessionId, publicUrl);
            onTranscriptionComplete(transcript);

        } catch (error: any) {
            console.error("Error processing audio in handleUploadAndTranscribe:", error);
            toast.error("오디오 처리 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"));
        } finally {
            setIsProcessing(false);
            setDuration(0);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-card border border-card-border rounded-2xl p-6 flex flex-col items-center justify-center space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <div className="text-gold font-medium">AI 서기 (Digital Scribe)</div>
            </div>

            {/* Waveform Visualization */}
            <div className="h-16 flex items-center justify-center gap-1 w-full max-w-md">
                {micError ? (
                    <div className="flex flex-col items-center gap-1 text-red-400">
                        <MicOff size={24} />
                        <span className="text-xs text-center">브라우저 설정에서 마이크 권한을 허용한 후 다시 시도해주세요.</span>
                    </div>
                ) : isRecording ? (
                    volume.map((h, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: h }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-1.5 bg-gold rounded-full"
                        />
                    ))
                ) : isProcessing ? (
                    <div className="flex gap-1 animate-pulse">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-1.5 h-8 bg-gold/50 rounded-full" />
                        ))}
                    </div>
                ) : (
                    <div className="text-slate-500 text-sm">대기 중... 상담을 시작하려면 녹음 버튼을 누르세요.</div>
                )}
            </div>

            <div className="text-2xl font-mono text-slate-200 font-bold">
                {formatTime(duration)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                {!isRecording && !isProcessing && (
                    <button
                        onClick={startRecording}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 text-white ${micError ? "bg-red-500/50 hover:bg-red-500/60" : "bg-red-500 hover:bg-red-600"
                            }`}
                        title={micError ? "다시 시도" : "녹음 시작"}
                    >
                        {micError ? <RefreshCw size={24} /> : <Mic size={28} />}
                    </button>
                )}

                {isRecording && (
                    <button
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center shadow-lg transition-transform active:scale-95 text-red-400"
                    >
                        <Square size={24} fill="currentColor" />
                    </button>
                )}

                {isProcessing && (
                    <div className="flex flex-col items-center gap-2 text-gold">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-xs">변환 및 분석 중...</span>
                    </div>
                )}
            </div>

            {isRecording && <p className="text-xs text-red-400 animate-pulse">● Recording in progress</p>}
        </div>
    );
}
