/**
 * Not Found Page
 *
 * This page is rendered whenever the user navigates to an unknown route.
 * Providing it ensures Vercel/Next can serve a friendly 404 instead of the generic error.
 */

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">404</p>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h1>
      <p className="mt-2 text-gray-600 max-w-xl">
        The page you're looking for doesn't exist. Go back home or explore the chat experience from the menu.
      </p>
    </div>
  )
}


