import {
  ArrowLeft,
  ShieldX,
} from 'lucide-react';

import { Link } from 'react-router';

export function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldX className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Access Denied
        </h1>

        <p className="mt-3 text-gray-600">
          Your account does not have permission to access
          this module.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}