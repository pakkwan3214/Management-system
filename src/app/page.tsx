import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Dealership Management System</h1>
      <p className="mt-2 text-sm text-gray-600">
        Foundation build. Authentication, users, and business modules are not implemented yet.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
