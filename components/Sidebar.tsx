/**
 * Sidebar Component
 * 
 * This is the navigation menu that appears on the left side of every page.
 * It shows links to different sections of the app and highlights the current page.
 * 
 * Features:
 * - Shows app logo/title at the top
 * - Navigation links to Dashboard, Therapy Chat, and Admin Dashboard
 * - Highlights the currently active page
 * - Uses icons for visual clarity
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, Settings, User } from 'lucide-react'

// List of navigation items with their paths and icons
const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Therapy Chat', href: '/chat', icon: MessageCircle },
    { name: 'Admin Dashboard', href: '/admin', icon: Settings },
]

/**
 * Sidebar Function
 * 
 * Renders the sidebar navigation menu.
 * Uses usePathname() to detect which page is currently active
 * and highlights that navigation item.
 */
export default function Sidebar() {
    // Get the current page URL to highlight active link
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full w-64 bg-white border-r border-gray-200">
            {/* App logo/title at the top */}
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-primary-600">SereneMind</h1>
            </div>

            {/* Navigation menu */}
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    {/* Loop through navigation items and create links */}
                    {navigation.map((item) => {
                        // Check if this link is for the current page
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                  ${isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                `}
                            >
                                {/* Icon for this navigation item */}
                                <item.icon
                                    className={`
                    mr-3 flex-shrink-0 h-6 w-6
                    ${isActive
                                            ? 'text-primary-600'
                                            : 'text-gray-400 group-hover:text-gray-500'
                                        }
                  `}
                                    aria-hidden="true"
                                />
                                {/* Link text */}
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
