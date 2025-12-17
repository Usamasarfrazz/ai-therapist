/**
 * Chat Message API Route
 * 
 * This is the main API endpoint that handles sending messages to the AI therapist.
 * It's called every time a user sends a message in the chat interface.
 * 
 * Endpoint: POST /api/chat/message
 * 
 * What it does:
 * 1. Receives the user's message and session ID
 * 2. Saves the user's message to the session
 * 3. Sends the conversation history to Google Gemini AI
 * 4. Gets the AI therapist's response
 * 5. Saves the AI's response to the session
 * 6. Every 5 messages, automatically evaluates the user's mental health
 * 7. Returns the AI's response to display in the chat
 */

import { NextResponse } from 'next/server'
import { generateTherapyResponse, evaluateMentalHealth } from '@/lib/gemini'
import { getChatSession, addMessage, updateEvaluation } from '@/lib/storage'

/**
 * POST Function
 * 
 * Handles POST requests when a user sends a message.
 * 
 * Request body should contain:
 * - sessionId: The unique ID of the chat session
 * - message: The text message the user typed
 * 
 * Returns:
 * - Success: { response: "AI therapist's reply text" }
 * - Error: Various error messages with appropriate status codes
 */
export async function POST(request: Request) {
  try {
    // Parse the request body to get session ID and message
    const body = await request.json()
    console.log('Received chat request:', body)
    const { sessionId, message } = body

    // Validate that we have both sessionId and message
    if (!sessionId || !message) {
      console.log('Missing sessionId or message')
      return NextResponse.json(
        { error: 'Session ID and message are required' },
        { status: 400 }
      )
    }

    // Check if the session exists
    const session = getChatSession(sessionId)
    if (!session) {
      console.log('Session not found:', sessionId)
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Step 1: Save the user's message to the session file
    addMessage(sessionId, 'user', message)

    // Step 2: Get the updated session (now includes the new user message)
    const updatedSession = getChatSession(sessionId)
    if (!updatedSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Step 3: Format all messages for sending to Gemini AI
    // We only need role and content, not timestamps
    const messages = updatedSession.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }))

    console.log('Calling Gemini API...')
    // Step 4: Send conversation to Gemini and get AI therapist response
    try {
      const response = await generateTherapyResponse(messages)
      console.log('Gemini response received')

      // Step 5: Save the AI's response to the session
      addMessage(sessionId, 'assistant', response)

      // Step 6: Every 5 messages, automatically evaluate mental health
      // This helps admins monitor user wellness and risk levels
      const finalSession = getChatSession(sessionId)
      if (finalSession && finalSession.messages.length >= 5 && finalSession.messages.length % 5 === 0) {
        // Convert all messages into a single text string for evaluation
        const conversationText = finalSession.messages
          .map(msg => `${msg.role === 'user' ? 'User' : 'Therapist'}: ${msg.content}`)
          .join('\n')

        try {
          // Ask Gemini to analyze the conversation and provide evaluation
          const evaluation = await evaluateMentalHealth(conversationText)
          // Save the evaluation (wellness score, risk level, etc.) to the session
          updateEvaluation(sessionId, {
            ...evaluation,
            evaluatedAt: new Date().toISOString(),
          })
        } catch (error) {
          // If evaluation fails, log it but don't break the chat
          console.error('Error evaluating mental health:', error)
        }
      }

      // Step 7: Return the AI's response to display in the chat
      return NextResponse.json({ response })
    } catch (geminiError) {
      // If Gemini API fails, return an error
      console.error('Gemini API Error:', geminiError)
      return NextResponse.json(
        { error: 'Failed to generate response from AI' },
        { status: 500 }
      )
    }

  } catch (error) {
    // Catch any other errors
    console.error('Error processing message:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

