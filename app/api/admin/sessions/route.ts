/**
 * Admin Sessions API Route
 * 
 * This API endpoint handles admin operations for viewing and managing chat sessions.
 * It's used by the admin dashboard to display all therapy sessions.
 * 
 * Endpoint: GET /api/admin/sessions - Get all sessions
 * Endpoint: DELETE /api/admin/sessions - Delete all sessions
 */

import { NextResponse } from 'next/server'
import { getAllSessions, deleteSession } from '@/lib/storage'

/**
 * GET Function
 * 
 * Returns a list of all chat sessions with summary information.
 * Used by the admin dashboard to display the session list.
 * 
 * Returns:
 * - Success: { sessions: [ { id, messageCount, evaluation, createdAt, updatedAt }, ... ] }
 * - Error: { error: "Failed to fetch sessions" } with status 500
 */
export async function GET() {
  try {
    // Get all sessions from storage
    const sessions = getAllSessions()

    // Format sessions for admin dashboard
    // We only send summary info, not full message history (to save bandwidth)
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      messageCount: session.messages.length,
      evaluation: session.evaluation,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }))

    return NextResponse.json({ sessions: formattedSessions })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

/**
 * DELETE Function
 * 
 * Deletes ALL chat sessions from storage.
 * This is used by the "Clear Data" button in the admin dashboard.
 * 
 * Returns:
 * - Success: { message: "All sessions cleared" }
 * - Error: { error: "Failed to clear sessions" } with status 500
 */
export async function DELETE() {
  try {
    // Get all sessions
    const sessions = getAllSessions()
    // Delete each session file one by one
    for (const session of sessions) {
      deleteSession(session.id)
    }
    return NextResponse.json({ message: 'All sessions cleared' })
  } catch (error) {
    console.error('Error clearing sessions:', error)
    return NextResponse.json(
      { error: 'Failed to clear sessions' },
      { status: 500 }
    )
  }
}
