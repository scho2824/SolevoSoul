'use server'

interface SMSResponse {
    success: boolean
    message: string
    result_code?: string
}

export async function sendSMS(
    to: string,
    text: string,
    title: string = 'SoulLog 알림'
): Promise<SMSResponse> {
    try {
        // Validation
        if (!to || !text) {
            return { success: false, message: '수신자 번호와 내용은 필수입니다.' }
        }

        // Environment Variables
        const ALIGO_KEY = process.env.ALIGO_KEY
        const ALIGO_USER_ID = process.env.ALIGO_USER_ID
        const ALIGO_SENDER = process.env.ALIGO_SENDER

        // Mock mode if envs are missing (for dev/demo)
        if (!ALIGO_KEY || !ALIGO_USER_ID || !ALIGO_SENDER) {
            console.log(`[SMS MOCK] Sending to ${to}: [${title}] ${text}`)
            // Simulate API latency
            await new Promise(resolve => setTimeout(resolve, 500))
            return { success: true, message: 'SMS 전송 성공 (Mock)' }
        }

        // Prepare Form Data for Aligo
        const formData = new FormData()
        formData.append('key', ALIGO_KEY)
        formData.append('user_id', ALIGO_USER_ID)
        formData.append('sender', ALIGO_SENDER)
        formData.append('receiver', to.replace(/-/g, '')) // Remove dashes
        formData.append('msg', text)
        formData.append('title', title)
        // formData.append('testmode_yn', 'Y') // Uncomment for Aligo test mode

        const response = await fetch('https://apis.aligo.in/send/', {
            method: 'POST',
            body: formData,
        })

        const result = await response.json()

        if (result.result_code === '1') {
            return { success: true, message: '전송 완료' }
        } else {
            console.error('Aligo API Error:', result)
            return {
                success: false,
                message: result.message || '전송 실패',
                result_code: result.result_code
            }
        }
    } catch (error: any) {
        console.error('SMS Send Error:', error)
        return { success: false, message: '서버 오류로 전송 실패' }
    }
}
