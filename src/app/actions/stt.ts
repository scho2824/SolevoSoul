'use server'

import { createClient } from '@/utils/supabase/server'

export async function transcribeAudio(sessionId: string, audioUrl: string) {
    const supabase = await createClient()

    const INVOKE_URL = process.env.NAVER_CLOVA_SPEECH_INVOKE_URL
    const SECRET_KEY = process.env.NAVER_CLOVA_SPEECH_SECRET_KEY

    if (!INVOKE_URL || !SECRET_KEY) {
        throw new Error('Naver CLOVA Speech API credentials are not configured.')
    }

    try {
        // 1. Download audio from Supabase Storage
        const response = await fetch(audioUrl)
        if (!response.ok) throw new Error('Failed to fetch audio file from storage')
        // const audioBlob = await response.blob() // check if needed

        // 2. Call Naver CLOVA Speech API
        const body = {
            language: 'ko-KR',
            completion: 'sync', // For simplicity in this demo; 'async' is better for long files
            callback: null,
            userdata: null,
            for_child: null,
            params: {
                service: 'solevo-log',
                priority: 0,
                domain: 'general'
            },
            url: audioUrl // Since we have the public URL from Supabase
        }

        const clovaResponse = await fetch(`${INVOKE_URL}/recognizer/url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CLOVASPEECH-API-KEY': SECRET_KEY
            },
            body: JSON.stringify(body)
        })

        if (!clovaResponse.ok) {
            const errorText = await clovaResponse.text()
            throw new Error(`CLOVA API Error: ${errorText}`)
        }

        const result = await clovaResponse.json()
        const transcription = result.text || ''

        // 3. Update the session transcript ONLY if sessionId is valid UUID
        // Regex for UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (uuidRegex.test(sessionId)) {
            const { data: currentSession } = await supabase
                .from('sessions')
                .select('transcript_text')
                .eq('id', sessionId)
                .single()

            if (currentSession) {
                const updatedTranscript = currentSession.transcript_text
                    ? `${currentSession.transcript_text}\n\n[추가 변환 내용]\n${transcription}`
                    : transcription

                await supabase
                    .from('sessions')
                    .update({ transcript_text: updatedTranscript })
                    .eq('id', sessionId)
            }
        } else {
            console.log(`Skipping DB update for invalid/temp session ID: ${sessionId}`);
        }

        return transcription
    } catch (error: any) {
        console.error('STT Transcription Error:', error)
        throw error
    }
}

export async function transcribeFile(formData: FormData) {
    const file = formData.get('audio') as File
    if (!file) throw new Error('No audio file provided')

    const INVOKE_URL = process.env.NAVER_CLOVA_SPEECH_INVOKE_URL
    const SECRET_KEY = process.env.NAVER_CLOVA_SPEECH_SECRET_KEY

    if (!INVOKE_URL || !SECRET_KEY) {
        throw new Error('Naver CLOVA Speech API credentials are not configured.')
    }

    try {
        // Naver CLOVA Speech supports multipart/form-data for file uploads
        const clovaFormData = new FormData()
        clovaFormData.append('media', file)

        const params = {
            language: 'ko-KR',
            completion: 'sync',
            service: 'solevo-log',
            domain: 'general'
        }
        clovaFormData.append('params', JSON.stringify(params))

        const clovaResponse = await fetch(`${INVOKE_URL}/recognizer/upload`, {
            method: 'POST',
            headers: {
                'X-CLOVASPEECH-API-KEY': SECRET_KEY
            },
            body: clovaFormData
        })

        if (!clovaResponse.ok) {
            const errorText = await clovaResponse.text()
            throw new Error(`CLOVA API Error: ${errorText}`)
        }

        const result = await clovaResponse.json()
        return result.text || ''
    } catch (error: any) {
        console.error('STT File Transcription Error:', error)
        throw error
    }
}
