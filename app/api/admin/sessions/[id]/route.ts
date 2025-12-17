/**
 * Admin Session Detail API Route
 * 
 * This API endpoint returns the full details of a specific chat session,
 * including all messages and evaluation data.
 * 
 * Endpoint: GET /api/admin/sessions/[id]
 * 
 * Used when an admin clicks "View Chat" to see the full conversation history.
 */

import { NextResponse } from 'next/server'
import { getChatSession } from '@/lib/storage'

/**
 * GET Function
 * 
 * Returns the complete session data including all messages.
 * 
 * URL parameter: id - The session ID to retrieve
 * 
 * Returns:
 * - Success: { session: { id, messages: [...], evaluation: {...}, ... } }
 * - Error: { error: "Session not found" } with status 404
 * - Error: { error: "Failed to fetch session" } with status 500
 */
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Get the session ID from the URL
        const sessionId = params.id
        // Load the full session data (including all messages)
        const session = getChatSession(sessionId)

        // Check if session exists
        if (!session) {
            return NextResponse.json(
                { error: 'Session not found' },
                { status: 404 }
            )
        }

        // Return the complete session data
        return NextResponse.json({ session })
    } catch (error) {
        console.error('Error fetching session:', error)
        return NextResponse.json(
            { error: 'Failed to fetch session' },
            { status: 500 }
        )
    }
}
