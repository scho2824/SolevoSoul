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
    onAudioUpdate?: (segments: AudioSegment[]) => void;
}

export interface AudioSegment {
    id: string;
    filename: string;
    publicUrl: string;
    duration: number;
    isTranscribing: boolean;
    isTranscribed: boolean;
}

export default function AudioRecorder({ sessionId, onTranscriptionComplete, onAudioUpdate }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [duration, setDuration] = useState(0);
    const [segments, setSegments] = useState<AudioSegment[]>([]);

    // Track duration at the point stopRecording was clicked
    const currentDurationRef = useRef(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [volume, setVolume] = useState<number[]>(new Array(20).fill(10));
    const [micError, setMicError] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        if (onAudioUpdate) {
            onAudioUpdate(segments);
        }
    }, [segments, onAudioUpdate]);

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
                const recordedLength = currentDurationRef.current;
                handleUpload(blob, recordedLength);
            };

            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyzer = audioContext.createAnalyser();
            source.connect(analyzer);
            analyzer.fftSize = 64;
            const dataArray = new Uint8Array(analyzer.frequencyBinCount);

            mediaRecorder.start();
            setIsRecording(true);
            setDuration(0);
            currentDurationRef.current = 0;

            timerRef.current = setInterval(() => {
                setDuration((prev) => {
                    const next = prev + 1;
                    currentDurationRef.current = next;
                    return next;
                });
                setVolume(prev => prev.map(() => Math.random() * 40 + 10));
            }, 1000); // 1초마다 갱신 (기존 100ms는 너무 빠름)

            // Waveform animation
            const waveformTimer = setInterval(() => {
                setVolume(prev => prev.map(() => Math.random() * 40 + 10));
            }, 100);

            // @ts-ignore
            mediaRecorderRef.current.waveformTimer = waveformTimer;

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
            // @ts-ignore
            if (mediaRecorderRef.current.waveformTimer) clearInterval(mediaRecorderRef.current.waveformTimer);

            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleUpload = async (blob: Blob, recordDuration: number) => {
        setIsUploading(true);
        try {
            const filename = `session_${sessionId}_${Date.now()}.webm`;
            const { error } = await supabase.storage
                .from('session-audio')
                .upload(`${sessionId}/${filename}`, blob);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('session-audio')
                .getPublicUrl(`${sessionId}/${filename}`);

            setSegments(prev => [...prev, {
                id: filename,
                filename,
                publicUrl,
                duration: recordDuration,
                isTranscribing: false,
                isTranscribed: false
            }]);

            toast.success("녹음이 저장되었습니다. 필요할 때 '변환하기'를 눌러주세요.");

        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("오디오 업로드 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"));
        } finally {
            setIsUploading(false);
            setDuration(0);
            currentDurationRef.current = 0;
        }
    };

    const handleTranscribe = async (segmentId: string, publicUrl: string) => {
        setSegments(prev => prev.map(s => s.id === segmentId ? { ...s, isTranscribing: true } : s));
        try {
            const transcript = await transcribeAudio(sessionId, publicUrl);
            onTranscriptionComplete(transcript);
            setSegments(prev => prev.map(s => s.id === segmentId ? { ...s, isTranscribing: false, isTranscribed: true } : s));
            toast.success("음성 변환이 완료되었습니다!");
        } catch (error: any) {
            setSegments(prev => prev.map(s => s.id === segmentId ? { ...s, isTranscribing: false } : s));
            toast.error("변환 중 오류 발생: " + error.message);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white border border-[#FDF2E9] rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4 w-full">
                <Mic className="text-[var(--color-soft-gold)]" size={20} />
                <h2 className="text-[#4A443F] font-bold">상담 녹음</h2>
                <span className="text-xs text-[#4A443F]/50 ml-auto bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#FDF2E9]">
                    수동 변환(개별 녹음 지원)
                </span>
            </div>

            {/* Waveform Visualization */}
            <div className="h-16 flex items-center justify-center gap-1 w-full max-w-md bg-[#FDFBF7] rounded-xl border border-[#FDF2E9] mb-4">
                {micError ? (
                    <div className="flex flex-col items-center gap-1 text-red-400">
                        <MicOff size={24} />
                        <span className="text-xs text-center">브라우저 마이크 권한을 허용해주세요.</span>
                    </div>
                ) : isRecording ? (
                    volume.map((h, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: h }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-1.5 bg-[var(--color-soft-gold)] rounded-full"
                        />
                    ))
                ) : isUploading ? (
                    <div className="flex items-center gap-2 text-[var(--color-soft-gold)] font-medium text-sm">
                        <Loader2 size={16} className="animate-spin" />
                        <span>서버에 저장 중...</span>
                    </div>
                ) : (
                    <div className="text-[#4A443F]/40 text-sm font-medium">대기 중... 마이크 버튼을 눌러 녹음을 시작하세요.</div>
                )}
            </div>

            <div className="text-3xl font-mono text-[var(--color-midnight-blue)] font-bold mb-6">
                {formatTime(isRecording ? duration : 0)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                {!isRecording && !isUploading && (
                    <button
                        onClick={startRecording}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 text-white ${micError ? "bg-red-400 hover:bg-red-500" : "bg-[var(--color-soft-gold)] hover:bg-[var(--color-soft-gold)]/90"
                            }`}
                        title={micError ? "다시 시도" : "녹음 시작"}
                    >
                        {micError ? <RefreshCw size={24} /> : <Mic size={28} />}
                    </button>
                )}

                {isRecording && (
                    <button
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-[#4A443F] hover:bg-[#4A443F]/90 flex items-center justify-center shadow-lg transition-transform active:scale-95 text-white animate-pulse"
                    >
                        <Square size={24} fill="currentColor" />
                    </button>
                )}
            </div>

            {isRecording && <p className="text-xs text-[#4A443F] font-bold mt-4">● 녹음 진행 중. 다음 녹음을 원하면 정지 후 다시 누르세요.</p>}

            {/* Segments List */}
            {segments.length > 0 && (
                <div className="w-full mt-8 space-y-3 pt-6 border-t border-[#FDF2E9]">
                    <h3 className="text-sm font-bold text-[#4A443F]/60 mb-2">녹음된 파일 목록</h3>
                    {segments.map((segment, index) => (
                        <div key={segment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#FDFBF7] border border-[#FDF2E9] p-3 rounded-xl gap-3 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="bg-[var(--color-soft-gold)]/10 text-[var(--color-soft-gold)] font-bold text-xs px-2 py-1 rounded-md">
                                    녹음 {index + 1}
                                </span>
                                <span className="text-[#4A443F]/80 text-sm font-mono font-medium">
                                    {formatTime(segment.duration)}
                                </span>
                            </div>
                            <button
                                onClick={() => handleTranscribe(segment.id, segment.publicUrl)}
                                disabled={segment.isTranscribing || segment.isTranscribed || isRecording}
                                className={`text-xs px-4 py-2 font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap ${segment.isTranscribed
                                    ? "bg-green-100 text-green-700 opacity-50 cursor-not-allowed"
                                    : segment.isTranscribing
                                        ? "bg-white border-2 border-[var(--color-soft-gold)] text-[var(--color-soft-gold)] opacity-50 cursor-not-allowed flex items-center gap-1"
                                        : isRecording
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-[var(--color-midnight-blue)] text-white hover:bg-[#4A443F]"
                                    }`}
                            >
                                {segment.isTranscribing && <Loader2 size={12} className="animate-spin" />}
                                {segment.isTranscribed ? "변환 완료" : segment.isTranscribing ? "변환 중..." : "글로 변환하기"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
