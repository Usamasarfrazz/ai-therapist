/**
 * Home Page Component
 * 
 * This is the landing page users see when they first visit the app.
 * It shows a welcome message, a card to start a therapy session, and a daily quote.
 * This page is accessible at the root URL: "/"
 */

import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'

/**
 * Home Function
 * 
 * Renders the home page with:
 * - Welcome heading
 * - "Talk to Therapist" card that links to the chat page
 * - Daily inspirational quote section
 */
export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome section at the top */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-600 mt-2">Your safe space for reflection and growth.</p>
      </div>

      {/* Card grid - currently shows one card to start therapy */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Main action card - clicking this takes user to chat page */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Talk to Therapist</h2>
          <p className="text-gray-600 text-sm mb-4">Start a confidential conversation with your AI companion.</p>
          {/* Link button that navigates to /chat page */}
          <Link href="/chat" className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
            Start Session <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Daily quote section - shows inspirational message */}
      <div className="bg-primary-50 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-medium text-primary-900 mb-4">Daily Quote</h3>
        <blockquote className="text-2xl font-serif text-primary-800 italic mb-4">
          "The only journey is the one within."
        </blockquote>
        <cite className="text-primary-600 font-medium">- Rainer Maria Rilke</cite>
      </div>
    </div>
  )
}

