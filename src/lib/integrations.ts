import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

// --- Encryption Utility (AES-256 Mock) ---
// In a real app, KEY and IV should be managed securely (e.g., KMS, Env Vars)
const ENCRYPTION_KEY = randomBytes(32);
const IV_LENGTH = 16;

export function encryptPII(text: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decryptPII(text: string): string {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift()!, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// --- Integration Stubs ---

export async function scheduleGoogleCalendarEvent(sessionDetails: Record<string, unknown>) {
    console.log("[STUB] Scheduling Google Calendar Event:", sessionDetails);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, eventId: "stub_game_event_123" };
}

export async function sendTwilioMessage(to: string, message: string) {
    console.log(`[STUB] Sending Twilio Message to ${to}: ${message}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, sid: "MM12345" };
}

export async function sendSendGridEmail(to: string, subject: string, body: string) {
    console.log(`[STUB] Sending Email to ${to} [${subject}]`);
    return { success: true };
}

export async function processClovaSpeech(audioUrl: string) {
    console.log(`[STUB] Processing Speech-to-Text via Naver Clova for: ${audioUrl}`);
    return {
        success: true,
        summary: "내담자는 직장 내 대인관계로 인한 스트레스를 호소함. 000 팀장과의 갈등이 주요 원인으로 보임.",
        keywords: ["직장", "스트레스", "상사", "이직"]
    };
}

export async function logAccess(userId: string, action: string, resourceId?: string) {
    console.log(`[AUDIT LOG] User: ${userId} | Action: ${action} | Resource: ${resourceId || "N/A"} | Timestamp: ${new Date().toISOString()}`);
    // In real app, write to 'access_logs' table
    return true;
}
