/**
 * Chat Session Creation API Route
 * 
 * This API endpoint creates a new chat session when a user starts chatting.
 * It's called automatically when the ChatInterface component loads.
 * 
 * Endpoint: POST /api/chat/create
 * 
 * What it does:
 * - Creates a new empty chat session
 * - Saves it to a JSON file in the data/sessions folder
 * - Returns a unique session ID that the frontend uses to track this conversation
 */

import { NextResponse } from 'next/server'
import { createChatSession } from '@/lib/storage'

/**
 * POST Function
 * 
 * Handles POST requests to create a new chat session.
 * 
 * Returns:
 * - Success: { sessionId: "session_1234567890_abc123" }
 * - Error: { error: "Failed to create session" } with status 500
 */
export async function POST() {
  try {
    // Create a new session and get its unique ID
    const sessionId = createChatSession()
    // Return the session ID to the frontend
    return NextResponse.json({ sessionId })
  } catch (error) {
    // If something goes wrong, log it and return an error response
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}


