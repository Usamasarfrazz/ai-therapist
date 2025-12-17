/**
 * Root Layout Component
 * 
 * This is the main wrapper for every page in the app.
 * It sets up the basic HTML structure and includes the sidebar navigation on every page.
 * Think of it as the "frame" that holds all pages together.
 */

import type { Metadata } from 'next'
import './globals.css'

import Sidebar from '@/components/Sidebar'

// This sets the title and description that appears in the browser tab
export const metadata: Metadata = {
  title: 'SereneMind - AI Therapist',
  description: 'Your personal companion for mental wellness.',
}

/**
 * RootLayout Function
 * 
 * This function wraps every page with:
 * - The Sidebar component (navigation menu on the left)
 * - The main content area (where each page's content goes)
 * 
 * The {children} prop is whatever page the user is currently viewing
 * (like Home, Chat, Admin, etc.)
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        {/* This creates a flexbox layout: sidebar on left, content on right */}
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar navigation menu - appears on every page */}
          <Sidebar />
          {/* Main content area - changes based on which page user is on */}
          <main className="flex-1 overflow-y-auto bg-gray-50 focus:outline-none">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}


