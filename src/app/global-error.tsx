'use client' // Error boundaries must be Client Components

import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import logger from "@/utils/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: globalThis.Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const [eventId, setEventId] = useState<string | null>(null)

  useEffect(() => {
    const id = Sentry.captureException(error);
    setEventId(id);
    logger.warn(`Reported with Sentry Event ID: ${id}`);
    if (error?.digest === '404') {
      router.push('/not-found');
    }
  }, [error, router]);
  
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Oops! Something went wrong.</h1>
          <p className="text-lg text-gray-600 mb-8">{' '}
            We’ve encountered an unexpected error. Our team has been notified. If you need assistance, reference the error ID: 
          </p>
          <div className="mb-8 text-sm text-gray-700">
            <div><span className="font-semibold">Sentry Event ID:</span> {eventId ?? '—'}</div>
            <div><span className="font-semibold">Digest (prod only):</span> {error.digest ?? '—'}</div>
          </div>

          <details className="bg-gray-200 p-4 rounded-md mb-8 w-full max-w-md">
            <summary className="cursor-pointer">Error Details (click to expand)</summary>
            <pre className="mt-2 text-sm text-gray-800 whitespace-pre-wrap break-words">
              {error.message ?? 'Unknown error'}
            </pre>
            <p className="mt-4 text-sm text-gray-700">
              {error.digest === '500'
                ? "It looks like our server is having trouble. Please try again later."
                : "An unexpected error occurred. We're working on fixing it."}
            </p>
          </details>

          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Go to Homepage
            </button>
            <button
              onClick={() => Sentry.captureMessage('User clicked Report this Error')}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Report this Error
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}