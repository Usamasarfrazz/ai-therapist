/**
 * Chat Page Component
 * 
 * This page displays the therapy chat interface where users can talk to the AI therapist.
 * It's accessible at the URL: "/chat"
 * 
 * This page is simple - it just shows a title and renders the ChatInterface component
 * which handles all the actual chat functionality.
 */

import ChatInterface from '@/components/ChatInterface'

/**
 * ChatPage Function
 * 
 * Renders the chat page with:
 * - A page title "Therapy Session"
 * - The ChatInterface component (which contains the actual chat box and messaging logic)
 */
export default function ChatPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Page heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Therapy Session</h1>
            {/* The actual chat component - handles all messaging, AI responses, etc. */}
            <ChatInterface />
        </div>
    )
}
