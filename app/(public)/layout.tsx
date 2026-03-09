import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary font-heading">
                Zoocasa
              </span>
              <span className="ml-2 text-gray-500">Blog</span>
            </Link>
            <nav className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary transition"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-gray-700 hover:text-primary transition"
              >
                Search
              </Link>
              <Link
                href="/admin"
                className="text-gray-700 hover:text-primary transition"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Zoocasa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
