/**
 * ChatInterface Component
 * 
 * This is the main chat component where users interact with the AI therapist.
 * It handles:
 * - Creating a new chat session when the component loads
 * - Displaying the conversation (user messages and AI responses)
 * - Sending user messages to the API
 * - Receiving and displaying AI responses
 * - Auto-scrolling to the latest message
 * - Showing a loading indicator while waiting for AI response
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

// Type definition for a chat message
interface Message {
  role: 'user' | 'assistant'  // Who sent the message
  content: string              // The message text
  timestamp: string            // When it was sent
}

/**
 * ChatInterface Function
 * 
 * Main chat component that manages the conversation state and UI.
 */
export default function ChatInterface() {
  // State: List of all messages in the conversation
  const [messages, setMessages] = useState<Message[]>([])
  // State: Current text in the input field
  const [input, setInput] = useState('')
  // State: Whether we're waiting for AI response (shows loading spinner)
  const [loading, setLoading] = useState(false)
  // State: Unique ID for this chat session (created when component loads)
  const [sessionId, setSessionId] = useState<string | null>(null)
  // Ref: Used to auto-scroll to bottom when new messages arrive
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // When component first loads, create a new chat session
  useEffect(() => {
    // Create a new session on mount
    fetch('/api/chat/create', { method: 'POST' })
      .then(res => res.json())
      .then(data => setSessionId(data.sessionId))
  }, [])

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  /**
   * handleSend Function
   * 
   * Called when user clicks Send button or presses Enter.
   * 
   * What it does:
   * 1. Validates that there's a message and we're not already loading
   * 2. Immediately adds user message to the UI (optimistic update)
   * 3. Sends the message to the API
   * 4. Waits for AI response
   * 5. Adds AI response to the UI
   * 6. Handles errors gracefully
   */
  const handleSend = async () => {
    // Don't send if input is empty, already loading, or no session ID
    if (!input.trim() || loading || !sessionId) return

    // Create a message object for the user's input
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    // Immediately show user's message in the chat (optimistic update)
    setMessages(prev => [...prev, userMessage])
    // Clear the input field
    setInput('')
    // Show loading spinner
    setLoading(true)

    try {
      // Send message to API and wait for AI response
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: input,  // Note: we use the original input, not the cleared state
        }),
      })

      const data = await response.json()

      // If we got a response from the AI, add it to the chat
      if (data.response) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      // If something went wrong, show an error message
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      // Always hide loading spinner when done
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-250px)] bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Messages area - scrollable list of all messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Show welcome message if no messages yet */}
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-2">Start a conversation</p>
            <p className="text-sm">Share what's on your mind, and I'm here to listen and support you.</p>
          </div>
        )}
        {/* Display all messages */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Message bubble - different colors for user vs AI */}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'  // User messages: blue background
                  : 'bg-gray-100 text-gray-900'   // AI messages: gray background
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {/* Loading spinner shown while waiting for AI response */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </div>
        )}
        {/* Invisible div used for auto-scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>
      {/* Input area at the bottom */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          {/* Text input field */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}  // Update state as user types
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}  // Send on Enter key
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={loading}  // Disable while waiting for response
          />
          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}  // Disable if empty or loading
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}


