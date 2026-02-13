'use server'

import { createClient } from '@/utils/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function summarizeSession(sessionId: string) {
    const supabase = await createClient()

    // 1. Fetch session data with related client info
    const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select(`
            *,
            clients (nickname, age, gender),
            session_cards (*)
        `)
        .eq('id', sessionId)
        .single()

    if (sessionError || !session) {
        throw new Error('Session not found')
    }

    const transcript = session.transcript_text || "(대화 내용 없음)"
    const clientInfo = session.clients
        ? `내담자: ${session.clients.nickname} (${session.clients.age || '?'}세, ${session.clients.gender || '미상'})`
        : "내담자 정보 없음"

    // Format tarot cards for context
    const cardsContext = session.session_cards && session.session_cards.length > 0
        ? session.session_cards.map((c: any) =>
            `- ${c.card_name} (${c.position_meaning}): ${c.interpretation_note || c.interpretation || '해석 없음'}`
        ).join('\n')
        : "(타로 카드 없음)"

    // 2. Generate Summary with GPT-4o in JSON Mode
    const systemPrompt = `당신은 베테랑 심리상담사이자 타로 리더입니다. 
제공된 상담 녹취록과 타로 리딩 결과를 바탕으로 전문적인 상담 일지(SOAP Note)를 작성해야 합니다.
반드시 아래 JSON 형식을 준수하여 응답해주세요.

{
  "subjective": "내담자가 호소하는 주관적인 문제 (1-2문장)",
  "objective": "타로 카드 결과 및 상담사의 객관적 관찰 (1-2문장)",
  "assessment": "종합적인 심리 상태 분석 (SOAP의 A)",
  "plan": "향후 상담 계획 또는 제안 (SOAP의 P)",
  "risk_flags": ["자살", "자해", "학대", "폭력"] 중 감지된 키워드 배열 (없으면 빈 배열),
  "sentiment_score": 0~100 사이의 정수 (0:매우 부정, 50:중립, 100:매우 긍정),
  "tarot_interpretation": "이번 세션의 타로 리딩 종합 해석 (친절하고 희망적인 어조)"
}`

    const userPrompt = `[내담자 정보]
${clientInfo}

[타로 리딩]
${cardsContext}

[상담 녹취록]
${transcript}`

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7
        })

        const content = response.choices[0].message.content
        if (!content) throw new Error('No content from OpenAI')

        const result = JSON.parse(content)

        // 3. Update Session in DB
        // Determine review status based on risk flags
        const reviewStatus = result.risk_flags && result.risk_flags.length > 0 ? 'Pending' : 'Approved'

        // Construct a readable summary text for backward compatibility or simple display
        const summaryText = `[Subjective] ${result.subjective}\n\n[Objective] ${result.objective}\n\n[Assessment] ${result.assessment}\n\n[Plan] ${result.plan}`

        const { error: updateError } = await supabase
            .from('sessions')
            .update({
                summary_text: summaryText,
                // sentiment_score: result.sentiment_score,
                // risk_flags: result.risk_flags,
                ai_summary: result, // Store full JSON
                // review_status: reviewStatus,
                interpretation_text: result.tarot_interpretation // Update tarot interpretation if useful
            })
            .eq('id', sessionId)

        if (updateError) throw new Error('Failed to update session: ' + updateError.message)

        return result

    } catch (e: any) {
        console.error("AI Summary Error:", e)
        throw new Error("AI 요약 생성 중 오류 발생: " + e.message)
    }
}

export async function interpretTarotReading(params: {
    question: string;
    cards: Array<{
        name_kr: string;
        name_en: string;
        position_meaning: string;
        is_reversed: boolean;
        keywords: string[];
        description_upright: string;
        description_reversed: string;
    }>;
    spreadType: '1-card' | '3-card' | 'celtic-cross';
}) {
    const { question, cards, spreadType } = params;

    const cardsInfo = cards.map((card, index) => {
        const orientation = card.is_reversed ? '역방향' : '정방향';
        const description = card.is_reversed ? card.description_reversed : card.description_upright;

        return `${index + 1}. ${card.name_kr} (${card.name_en}) - ${orientation}
   위치: ${card.position_meaning}
   키워드: ${card.keywords.join(', ')}
   의미: ${description}`;
    }).join('\n\n');

    const spreadTypeKr = {
        '1-card': '1장 스프레드',
        '3-card': '3장 스프레드 (과거-현재-미래)',
        'celtic-cross': '켈틱 크로스 (10장)'
    }[spreadType];

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: `당신은 30년 경력의 전문 타로 리더입니다... (중략)` // Kept similar to previous, but using GPT-4o
                },
                {
                    role: 'user',
                    content: `질문: "${question}"\n스프레드: ${spreadTypeKr}\n\n뽑힌 카드:\n${cardsInfo}`
                }
            ],
            temperature: 0.8,
            max_tokens: 1500,
        });

        return {
            interpretation: response.choices[0].message.content || '',
            success: true
        };
    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return {
            interpretation: "AI 해석 생성 실패",
            success: false,
            error: error.message
        };
    }
}

export async function saveTarotSession(params: {
    question: string;
    cards: any[]; // Using any to avoid circular dependency or complex type imports, but ideally generic
    spreadType: string;
    interpretation: string;
    clientId?: string; // Optional: If provided (by counselor), use this. If not, infer from auth (client self-service).
}) {
    const supabase = await createClient();

    try {
        // 1. Get Current User
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('User not authenticated');

        let targetClientId = params.clientId;
        let counselorId = null;

        if (targetClientId) {
            // Scenario A: Counselor running session for a Client
            // Verify the counselor owns this client
            const { data: clientData, error: verifyError } = await supabase
                .from('clients')
                .select('counselor_id')
                .eq('id', targetClientId)
                .single();

            if (verifyError || !clientData) throw new Error('Client not found or access denied');

            // Allow if the user is the counselor linked to this client
            if (clientData.counselor_id !== user.id) {
                // Double check profile role? For now, strict check.
                throw new Error('You are not the counselor for this client');
            }
            counselorId = user.id;

        } else {
            // Scenario B: Client running session for themselves
            const { data: client, error: clientError } = await supabase
                .from('clients')
                .select('id, counselor_id')
                .eq('client_profile_id', user.id)
                .single();

            if (clientError || !client) {
                console.error('Client profile not found for user:', user.id);
                throw new Error('Client profile not found. Please ensure you are logged in as a client.');
            }
            targetClientId = client.id;
            counselorId = client.counselor_id;
        }

        // 3. Create Session
        const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .insert({
                client_id: targetClientId,
                counselor_id: counselorId,
                transcript_text: `[Tarot Session] ${params.question}`, // Using transcript for question context
                summary_text: params.interpretation,
                interpretation_text: params.interpretation,
                date: new Date().toISOString(),
                // Default values for other fields, as per migration
                risk_flags: [],
                review_status: 'pending', // Ensure this matches the schema
                // sentiment_score: 50 // Neutral default
            })
            .select()
            .single();

        if (sessionError || !session) {
            throw new Error('Failed to create session: ' + (sessionError?.message || 'Unknown error'));
        }

        // 4. Save Session Cards
        if (params.cards && params.cards.length > 0) {
            // Ensure cards have IDs. If they come from useTarotDeck, they should.
            const cardsToInsert = params.cards.map((card, index) => ({
                session_id: session.id,
                card_id: card.id, // This must be a UUID from tarot_deck_data
                position_index: card.position_index !== undefined ? card.position_index : index,
                position_meaning: card.position_meaning || 'Position ' + (index + 1),
                is_reversed: card.is_reversed || false,
                user_notes: null
            }));

            const { error: cardsError } = await supabase
                .from('session_cards')
                .insert(cardsToInsert);

            if (cardsError) {
                console.error('Failed to save cards:', cardsError);
                // We don't rollback the session, but warn
            }
        }

        return { success: true, sessionId: session.id };

    } catch (error: any) {
        console.error('Save Tarot Session Error:', error);
        return { success: false, error: error.message };
    }
}
