"use server";

import { scheduleGoogleCalendarEvent, sendTwilioMessage, logAccess } from "@/lib/integrations";

export async function bookSession(userId: string, slotTime: string) {
    console.log("Server Action: bookSession started");

    // 1. Audit Log
    await logAccess(userId, "BOOK_SESSION", slotTime);

    // 2. Schedule Calendar
    const calendarResult = await scheduleGoogleCalendarEvent({
        summary: "Tarot Counseling Session",
        start: slotTime,
        attendees: [userId] // stub
    });

    // 3. Schedule Reminder (Mock Logic: IF booked -> Schedule automated message)
    if (calendarResult.success) {
        // In real world, this would be a scheduled job, but here we just log the intent
        console.log("Scheduling Reminder for 24h before...");
        // For demo, send immediate confirmation
        await sendTwilioMessage(userId, "예약이 확정되었습니다. 상담 24시간 전에 알림을 보내드립니다.");
    }

    return { success: true, message: "Booking Confirmed" };
}
