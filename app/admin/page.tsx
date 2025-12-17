/**
 * Admin Dashboard Page Component
 * 
 * This is the admin dashboard page that displays all therapy sessions with evaluations.
 * It's accessible at the URL: "/admin"
 * 
 * Features:
 * - Shows statistics (total sessions, high risk count)
 * - Lists all sessions with their evaluation summaries
 * - Allows searching sessions by ID or emotional state
 * - "View Chat" button to see full conversation history
 * - "Clear Data" button to delete all sessions
 * - Auto-refreshes every 30 seconds to show latest data
 * - Modal popup to view full conversation when clicking "View Chat"
 */

'use client'

import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, CheckCircle, Clock, MessageSquare, Search, Eye, X, User, Bot, Trash2, Info } from 'lucide-react'

// Type definition: Complete session data including full message history
interface Session {
  id: string                   // Unique session ID
  messageCount: number         // Number of messages in session
  messages?: Array<{           // Optional: Full message history (loaded when viewing chat)
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  evaluation?: {               // Optional: Mental health evaluation (if session has 5+ messages)
    wellnessScore: number       // Score from 1-100
    emotionalState: string      // Brief emotional description
    keyConcerns: string[]       // List of main concerns
    riskLevel: 'low' | 'medium' | 'high'  // Risk assessment
    recommendations: string[]   // Suggested actions
    summary: string            // Clinical summary
    evaluatedAt: string        // When evaluation was done
  }
  createdAt: string            // When session was created
  updatedAt: string            // When session was last updated
}

/**
 * AdminDashboard Function
 * 
 * Main admin dashboard component that displays session monitoring interface.
 */
export default function AdminDashboard() {
  // State: List of all sessions loaded from API
  const [sessions, setSessions] = useState<Session[]>([])
  // State: Whether we're still loading sessions
  const [loading, setLoading] = useState(true)
  // State: Search term for filtering sessions
  const [searchTerm, setSearchTerm] = useState('')
  // State: Currently selected session (for showing full conversation modal)
  const [viewingSession, setViewingSession] = useState<Session | null>(null)

  // When component loads, fetch sessions and set up auto-refresh
  useEffect(() => {
    loadSessions()
    // Refresh sessions every 30 seconds to show latest data
    const interval = setInterval(loadSessions, 30000)
    // Cleanup: stop refreshing when component unmounts
    return () => clearInterval(interval)
  }, [])

  /**
   * loadSessions Function
   * 
   * Fetches all sessions from the API and updates state.
   * Filters out empty sessions (sessions with 0 messages).
   */
  const loadSessions = async () => {
    try {
      // Call API to get all sessions
      const response = await fetch('/api/admin/sessions')
      const data = await response.json()
      // Filter out empty sessions to reduce clutter
      const validSessions = (data.sessions || []).filter((s: Session) => s.messageCount > 0)
      setSessions(validSessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      // Always stop loading, even if there was an error
      setLoading(false)
    }
  }

  /**
   * clearSessions Function
   * 
   * Deletes ALL sessions from storage.
   * Shows a confirmation dialog first to prevent accidental deletion.
   */
  const clearSessions = async () => {
    // Ask user to confirm before deleting everything
    if (!confirm('Are you sure you want to delete ALL sessions? This cannot be undone.')) return

    try {
      // Call API to delete all sessions
      await fetch('/api/admin/sessions', { method: 'DELETE' })
      // Reload sessions list (will be empty now)
      loadSessions()
    } catch (error) {
      console.error('Failed to clear sessions:', error)
    }
  }

  /**
   * viewConversation Function
   * 
   * Loads the full conversation history for a specific session.
   * Called when admin clicks "View Chat" button.
   * 
   * Parameters:
   * - sessionId: The ID of the session to view
   */
  const viewConversation = async (sessionId: string) => {
    try {
      // Fetch full session data including all messages
      const response = await fetch(`/api/admin/sessions/${sessionId}`)
      const data = await response.json()
      // Set the session to show in modal
      setViewingSession(data.session)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  /**
   * getRiskStyling Function
   * 
   * Returns CSS classes for styling risk level badges.
   * Used to color-code risk indicators (red/yellow/green).
   * 
   * Parameters:
   * - level: 'high' | 'medium' | 'low' | undefined
   * 
   * Returns:
   * - string: Tailwind CSS classes for background, text, and border colors
   */
  const getRiskStyling = (level?: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800 border-red-200',      // Red for high risk
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',  // Yellow for medium
      low: 'bg-green-100 text-green-800 border-green-200',  // Green for low
      default: 'bg-gray-100 text-gray-800 border-gray-200'  // Gray for unknown/pending
    }
    return styles[level as keyof typeof styles] || styles.default
  }

  /**
   * getScoreStyling Function
   * 
   * Returns CSS class for text color based on wellness score.
   * Higher scores = green, medium = yellow, low = red.
   * 
   * Parameters:
   * - score: Wellness score from 1-100 (or undefined)
   * 
   * Returns:
   * - string: Tailwind CSS class for text color
   */
  const getScoreStyling = (score?: number) => {
    if (!score) return 'text-gray-500'           // Gray if no score
    if (score >= 80) return 'text-green-600'     // Green for stable (80-100)
    if (score >= 50) return 'text-yellow-600'    // Yellow for moderate (50-79)
    return 'text-red-600'                        // Red for critical (1-49)
  }

  // Filter sessions based on search term
  const filteredSessions = sessions.filter(session =>
    session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.evaluation?.emotionalState.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate dashboard statistics
  const stats = {
    total: sessions.length,
    highRisk: sessions.filter(s => s.evaluation?.riskLevel === 'high').length,
    mediumRisk: sessions.filter(s => s.evaluation?.riskLevel === 'medium').length,
    lowRisk: sessions.filter(s => s.evaluation?.riskLevel === 'low').length
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinical Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor therapy sessions and patient assessments</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Statistics Cards */}
          <div className="flex items-center space-x-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Sessions</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">High Risk</p>
                  <p className="text-xl font-bold text-gray-900">{stats.highRisk}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={clearSessions}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Data
          </button>
        </div>
      </div>



      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by session ID or emotional state..."
          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        /* Sessions List */
        <div className="grid gap-6">
          {filteredSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Session Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Session #{session.id.slice(-8)}
                      </h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRiskStyling(session.evaluation?.riskLevel)}`}>
                        {session.evaluation?.riskLevel?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(session.createdAt).toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {session.messageCount} messages
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {session.evaluation && (
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreStyling(session.evaluation.wellnessScore)}`}>
                          {session.evaluation.wellnessScore}/100
                        </p>
                        <p className="text-xs text-gray-500">Wellness Score</p>
                      </div>
                    )}
                    <button
                      onClick={() => viewConversation(session.id)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Chat
                    </button>
                  </div>
                </div>

                {/* Evaluation Display */}
                {session.evaluation ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Clinical Summary</h4>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          {session.evaluation.summary}
                        </p>

                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Concerns</h4>
                        <div className="flex flex-wrap gap-2">
                          {session.evaluation.keyConcerns.map((concern, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Emotional State</h4>
                        <p className="text-sm text-gray-700 mb-4">{session.evaluation.emotionalState}</p>

                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                          {session.evaluation.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500 text-sm">
                      Evaluation pending - requires at least 5 messages
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredSessions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
              <p className="text-gray-500">No sessions found</p>
            </div>
          )}
        </div>
      )}

      {/* Chat Viewer Modal */}
      {viewingSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Conversation History - Session #{viewingSession.id.slice(-8)}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {viewingSession.messages?.length || 0} messages • Started {new Date(viewingSession.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setViewingSession(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {viewingSession.messages?.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className="flex items-center mb-1 space-x-2">
                      {msg.role === 'assistant' && <Bot className="w-4 h-4 text-primary-600" />}
                      {msg.role === 'user' && <User className="w-4 h-4 text-gray-600" />}
                      <span className="text-xs text-gray-500">
                        {msg.role === 'user' ? 'Patient' : 'AI Therapist'} • {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className={`rounded-lg px-4 py-3 ${msg.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                      }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

