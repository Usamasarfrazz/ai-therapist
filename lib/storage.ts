/**
 * Storage Service
 * 
 * This file handles saving and loading chat sessions from the file system.
 * Each chat session is stored as a JSON file in the data/sessions folder.
 * 
 * This is a simple file-based "database" - no real database needed for this project.
 * Each session gets its own file named: session_[timestamp]_[random].json
 * 
 * Functions provided:
 * - createChatSession() - Creates a new empty session file
 * - getChatSession() - Loads a session from file
 * - addMessage() - Adds a message to a session
 * - updateEvaluation() - Saves mental health evaluation to a session
 * - getAllSessions() - Gets all sessions (for admin dashboard)
 * - deleteSession() - Deletes a session file
 * - getSessionStats() - Gets statistics about all sessions
 */

import fs from 'fs'
import path from 'path'

// Type definition: A single message in a conversation
interface ChatMessage {
  role: 'user' | 'assistant'  // Who sent it
  content: string              // The message text
  timestamp: string            // When it was sent
}

// Type definition: A complete chat session with all messages and optional evaluation
interface ChatSession {
  id: string                   // Unique session ID
  messages: ChatMessage[]      // All messages in this conversation
  evaluation?: {               // Optional mental health evaluation (added every 5 messages)
    wellnessScore: number
    emotionalState: string
    keyConcerns: string[]
    riskLevel: 'low' | 'medium' | 'high'
    recommendations: string[]
    summary: string
    evaluatedAt: string
  }
  createdAt: string            // When session was created
  updatedAt: string            // When session was last updated
}

// Path to the folder where we store session files
const STORAGE_DIR = path.join(process.cwd(), 'data', 'sessions')

/**
 * initializeStorage Function
 * 
 * Makes sure the sessions folder exists.
 * If it doesn't exist, creates it.
 * Called automatically before any file operations.
 */
function initializeStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true })
  }
}

/**
 * getSessionPath Function
 * 
 * Helper function that builds the full file path for a session.
 * 
 * Parameters:
 * - sessionId: The unique session ID
 * 
 * Returns:
 * - string: Full path like "data/sessions/session_1234567890_abc123.json"
 */
function getSessionPath(sessionId: string): string {
  return path.join(STORAGE_DIR, `${sessionId}.json`)
}

/**
 * createChatSession Function
 * 
 * Creates a new empty chat session and saves it to a file.
 * Called when a user starts a new conversation.
 * 
 * Returns:
 * - string: The unique session ID (e.g., "session_1234567890_abc123")
 */
export function createChatSession(): string {
  // Make sure storage folder exists
  initializeStorage()

  // Generate a unique ID: session_[current timestamp]_[random string]
  const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  
  // Create a new empty session object
  const session: ChatSession = {
    id,
    messages: [],  // Start with no messages
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Save the session to a JSON file
  fs.writeFileSync(getSessionPath(id), JSON.stringify(session, null, 2))

  // Return the session ID so the frontend can use it
  return id
}

/**
 * getChatSession Function
 * 
 * Loads a chat session from its file.
 * 
 * Parameters:
 * - id: The session ID to load
 * 
 * Returns:
 * - ChatSession object if found
 * - undefined if session doesn't exist or file can't be read
 */
export function getChatSession(id: string): ChatSession | undefined {
  // Make sure storage folder exists
  initializeStorage()

  // Get the file path for this session
  const filePath = getSessionPath(id)

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return undefined
  }

  try {
    // Read the file and parse the JSON
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file is corrupted or can't be read, return undefined
    console.error('Error reading session:', error)
    return undefined
  }
}

/**
 * addMessage Function
 * 
 * Adds a new message to an existing chat session.
 * Used when user sends a message or AI responds.
 * 
 * Parameters:
 * - sessionId: The session to add the message to
 * - role: 'user' (from user) or 'assistant' (from AI)
 * - content: The message text
 * 
 * Does nothing if session doesn't exist.
 */
export function addMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
  // Load the session
  const session = getChatSession(sessionId)
  if (!session) return  // Exit if session not found

  // Add the new message to the messages array
  session.messages.push({
    role,
    content,
    timestamp: new Date().toISOString(),
  })
  // Update the "last updated" timestamp
  session.updatedAt = new Date().toISOString()

  // Save the updated session back to the file
  fs.writeFileSync(getSessionPath(sessionId), JSON.stringify(session, null, 2))
}

/**
 * updateEvaluation Function
 * 
 * Saves a mental health evaluation to a session.
 * Called automatically every 5 messages to assess user wellness.
 * 
 * Parameters:
 * - sessionId: The session to update
 * - evaluation: The evaluation object (wellness score, risk level, etc.)
 * 
 * Does nothing if session doesn't exist.
 */
export function updateEvaluation(sessionId: string, evaluation: ChatSession['evaluation']) {
  // Load the session
  const session = getChatSession(sessionId)
  if (!session) return  // Exit if session not found

  // Attach the evaluation to the session
  session.evaluation = evaluation

  // Save the updated session back to the file
  fs.writeFileSync(getSessionPath(sessionId), JSON.stringify(session, null, 2))
}

/**
 * getAllSessions Function
 * 
 * Loads all chat sessions from the storage folder.
 * Used by the admin dashboard to show all sessions.
 * 
 * Returns:
 * - Array of ChatSession objects, sorted by most recently updated first
 * - Empty array if there are no sessions or an error occurs
 */
export function getAllSessions(): ChatSession[] {
  // Make sure storage folder exists
  initializeStorage()

  try {
    // Get list of all files in the sessions folder
    const files = fs.readdirSync(STORAGE_DIR)
    const sessions: ChatSession[] = []

    // Loop through each file
    for (const file of files) {
      // Only process JSON files (ignore any other files)
      if (file.endsWith('.json')) {
        // Read and parse each session file
        const data = fs.readFileSync(path.join(STORAGE_DIR, file), 'utf-8')
        sessions.push(JSON.parse(data))
      }
    }

    // Sort sessions by most recently updated first (newest at top)
    return sessions.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  } catch (error) {
    // If something goes wrong, return empty array
    console.error('Error reading sessions:', error)
    return []
  }
}

/**
 * deleteSession Function
 * 
 * Deletes a session file from storage.
 * Used when admin clears sessions or for cleanup.
 * 
 * Parameters:
 * - sessionId: The session ID to delete
 * 
 * Returns:
 * - true if session was deleted
 * - false if session file didn't exist
 */
export function deleteSession(sessionId: string): boolean {
  // Get the file path for this session
  const filePath = getSessionPath(sessionId)

  // If file exists, delete it
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    return true
  }

  // File didn't exist
  return false
}

/**
 * getSessionStats Function
 * 
 * Calculates statistics about all sessions.
 * Used for admin dashboard to show overview numbers.
 * 
 * Returns:
 * - Object with counts: total, withEvaluations, highRisk, mediumRisk, lowRisk
 */
export function getSessionStats() {
  // Get all sessions
  const sessions = getAllSessions()

  // Calculate and return statistics
  return {
    total: sessions.length,  // Total number of sessions
    withEvaluations: sessions.filter(s => s.evaluation).length,  // Sessions that have been evaluated
    highRisk: sessions.filter(s => s.evaluation?.riskLevel === 'high').length,  // High risk sessions
    mediumRisk: sessions.filter(s => s.evaluation?.riskLevel === 'medium').length,  // Medium risk sessions
    lowRisk: sessions.filter(s => s.evaluation?.riskLevel === 'low').length,  // Low risk sessions
  }
}

