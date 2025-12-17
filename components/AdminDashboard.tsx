/**
 * AdminDashboard Component
 * 
 * This component displays an admin dashboard for monitoring therapy sessions.
 * It shows statistics, session lists, and allows viewing evaluation details.
 * 
 * Features:
 * - Displays summary statistics (total sessions, evaluated, high risk, average wellness)
 * - Lists all therapy sessions with their evaluation status
 * - Shows a modal with detailed evaluation when clicking a session
 * - Auto-refreshes every 30 seconds to show latest data
 */

'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, AlertCircle, TrendingUp, Clock } from 'lucide-react'
import { format } from 'date-fns'

// Type definition: Mental health evaluation data
interface Evaluation {
  wellnessScore: number        // Score from 1-10 (or 1-100 in other component)
  emotionalState: string       // Brief description like "Anxious and Defeated"
  keyConcerns: string[]        // List of main concerns identified
  riskLevel: 'low' | 'medium' | 'high'  // Risk assessment level
  recommendations: string[]    // Suggested actions or interventions
  summary: string              // Clinical summary paragraph
  evaluatedAt: string          // When evaluation was performed
}

// Type definition: Summary of a chat session (without full message history)
interface ChatSession {
  id: string                   // Unique session ID
  messageCount: number         // Number of messages in this session
  evaluation?: Evaluation      // Optional evaluation (only if session has 5+ messages)
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
  const [sessions, setSessions] = useState<ChatSession[]>([])
  // State: Currently selected session (for showing evaluation modal)
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  // State: Whether we're still loading sessions
  const [loading, setLoading] = useState(true)

  // When component loads, fetch sessions and set up auto-refresh
  useEffect(() => {
    fetchSessions()
    // Refresh sessions every 30 seconds to show latest data
    const interval = setInterval(fetchSessions, 30000)
    // Cleanup: stop refreshing when component unmounts
    return () => clearInterval(interval)
  }, [])

  /**
   * fetchSessions Function
   * 
   * Loads all sessions from the API and updates the state.
   * Called on component mount and every 30 seconds.
   */
  const fetchSessions = async () => {
    try {
      // Call API to get all sessions
      const response = await fetch('/api/admin/sessions')
      const data = await response.json()
      // Update state with the sessions
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      // Always stop loading, even if there was an error
      setLoading(false)
    }
  }

  /**
   * getRiskColor Function
   * 
   * Returns CSS classes for styling based on risk level.
   * Used to color-code risk badges (red for high, yellow for medium, green for low).
   * 
   * Parameters:
   * - risk: 'high' | 'medium' | 'low'
   * 
   * Returns:
   * - string: Tailwind CSS classes for background, text, and border colors
   */
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'  // Red styling for high risk
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'  // Yellow for medium
      default:
        return 'bg-green-100 text-green-800 border-green-200'  // Green for low/default
    }
  }

  /**
   * getScoreColor Function
   * 
   * Returns CSS class for text color based on wellness score.
   * Higher scores = green, medium = yellow, low = red.
   * 
   * Parameters:
   * - score: Wellness score (appears to be 1-10 scale in this component)
   * 
   * Returns:
   * - string: Tailwind CSS class for text color
   */
  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600'   // Good wellness
    if (score >= 4) return 'text-yellow-600'  // Moderate wellness
    return 'text-red-600'                     // Poor wellness
  }

  // Calculate statistics from the sessions data
  const stats = {
    total: sessions.length,  // Total number of sessions
    evaluated: sessions.filter(s => s.evaluation).length,  // Sessions that have evaluations
    highRisk: sessions.filter(s => s.evaluation?.riskLevel === 'high').length,  // High risk count
    // Calculate average wellness score (only for sessions with evaluations)
    avgScore: sessions
      .filter(s => s.evaluation)
      .reduce((acc, s) => acc + (s.evaluation?.wellnessScore || 0), 0) /
      (sessions.filter(s => s.evaluation).length || 1),
  }

  // Show loading spinner while fetching sessions
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mental Health Evaluations</h2>
        <p className="text-gray-600">Monitor and analyze therapy conversations</p>
      </div>

      {/* Statistics cards showing overview numbers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card: Total Sessions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        {/* Card: Evaluated Sessions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Evaluated</p>
              <p className="text-2xl font-bold text-gray-900">{stats.evaluated}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        {/* Card: High Risk Sessions */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">{stats.highRisk}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        {/* Card: Average Wellness Score */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Wellness</p>
              {/* Color-coded score (green/yellow/red) */}
              <p className={`text-2xl font-bold ${getScoreColor(stats.avgScore)}`}>
                {stats.avgScore.toFixed(1)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* List of all therapy sessions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {/* Show message if no sessions exist */}
          {sessions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No chat sessions yet. Sessions will appear here once users start conversations.
            </div>
          ) : (
            /* Display each session as a clickable row */
            sessions.map((session) => (
              <div
                key={session.id}
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedSession(session)}  // Click to view evaluation details
              >
                <div className="flex items-center justify-between">
                  {/* Left side: Session info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {/* Show shortened session ID */}
                      <p className="font-medium text-gray-900">
                        Session {session.id.substring(5, 13)}
                      </p>
                      {/* Message count */}
                      <span className="text-sm text-gray-500">
                        {session.messageCount} messages
                      </span>
                    </div>
                    {/* Last updated timestamp */}
                    <p className="text-sm text-gray-600">
                      {format(new Date(session.updatedAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  {/* Right side: Evaluation status */}
                  {session.evaluation ? (
                    <div className="flex items-center space-x-4">
                      {/* Wellness score display */}
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(session.evaluation.wellnessScore)}`}>
                          {session.evaluation.wellnessScore}/10
                        </p>
                        <p className="text-xs text-gray-500">Wellness</p>
                      </div>
                      {/* Risk level badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(
                          session.evaluation.riskLevel
                        )}`}
                      >
                        {session.evaluation.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  ) : (
                    /* Show "Pending" if no evaluation yet */
                    <span className="text-sm text-gray-400">Pending evaluation</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal popup showing detailed evaluation when a session is clicked */}
      {selectedSession?.evaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal header with close button */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">Evaluation Details</h3>
              {/* Close button - clicking sets selectedSession to null */}
              <button
                onClick={() => setSelectedSession(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {/* Modal content - all evaluation details */}
            <div className="p-6 space-y-6">
              {/* Wellness Score and Risk Level */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Wellness Score</h4>
                <div className="flex items-center space-x-4">
                  {/* Large score display with color coding */}
                  <p className={`text-4xl font-bold ${getScoreColor(selectedSession.evaluation.wellnessScore)}`}>
                    {selectedSession.evaluation.wellnessScore}/10
                  </p>
                  {/* Risk level badge */}
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${getRiskColor(
                      selectedSession.evaluation.riskLevel
                    )}`}
                  >
                    {selectedSession.evaluation.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
              </div>

              {/* Emotional State */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Emotional State</h4>
                <p className="text-gray-900">{selectedSession.evaluation.emotionalState}</p>
              </div>

              {/* Key Concerns - displayed as tags */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Key Concerns</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSession.evaluation.keyConcerns.length > 0 ? (
                    selectedSession.evaluation.keyConcerns.map((concern, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {concern}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">None identified</span>
                  )}
                </div>
              </div>

              {/* Recommendations - bulleted list */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {selectedSession.evaluation.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Clinical Summary */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Summary</h4>
                <p className="text-gray-700 leading-relaxed">{selectedSession.evaluation.summary}</p>
              </div>

              {/* Evaluation timestamp */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Evaluated: {format(new Date(selectedSession.evaluation.evaluatedAt), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


