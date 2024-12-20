'use client' // Error boundaries must be Client Components

import * as Sentry from "@sentry/nextjs";
import Error from "next/error";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import logger from "@/utils/logger";

export default function GlobalError({
  error,
  resetErrorBoundary,
}: {
  error: Error & { digest?: string }
  resetErrorBoundary?: () => void
}) {
  const router = useRouter();

  useEffect(() => {
    const eventId = Sentry.captureException(error);
    logger.log(`Reported with Sentry Event ID: ${eventId}`);
    if (error?.digest === '404') {
      router.push('/not-found');
    }
  }, [error, router]);

  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      router.refresh();
    }
  };

  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center p-4">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Oops! Something went wrong.</h1>
          <p className="text-lg text-gray-600 mb-8">{' '}
            We’ve encountered an unexpected error. Our team has been notified. If you need assistance, reference the error ID: 
            <span className="font-semibold text-gray-800"> {error.digest || 'N/A'} </span>.
          </p>

          {error && (
            <details className="bg-gray-200 p-4 rounded-md mb-8 w-full max-w-md">
              <summary className="cursor-pointer">Error Details (click to expand)</summary>
              <pre className="mt-2 text-sm text-gray-800">{error.digest}</pre>
              <p className="text-lg text-gray-600 mb-8">
                {error.digest === '500' ? 
                  "It looks like our server is having trouble. Please try again later." :
                  "An unexpected error occurred. We're working on fixing it."
                }
              </p>
            </details>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
            <button
              onClick={() => resetErrorBoundary?.()}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Go to Homepage
            </button>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            If this issue persists, please{' '}
            <button
              onClick={() => Sentry.captureMessage('User submitted error report')}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Report this Error
            </button>
          </p>
        </div>
      </body>
    </html>
  )
}