import Link from "next/link";

import { Button } from "@ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Content */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The drilling data you&apos;re looking for seems to have gone off the
            grid. Let&apos;s get you back to the main platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium">
              🛢️ Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Drilling-themed illustration */}
        <div className="mt-12 text-gray-400">
          <div className="text-4xl mb-2">⛏️</div>
          <p className="text-sm">
            &quot;Every great well starts with the right direction&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
