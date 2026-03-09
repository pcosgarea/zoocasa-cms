export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-white to-gray-50">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6 text-heading">Zoocasa CMS</h1>
        <p className="text-xl text-gray-700 mb-8">
          Your blog content management system is ready!
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-start">
              <span className="text-green-500 mr-3 text-xl">✓</span>
              <div>
                <strong>Database Setup Complete</strong>
                <p className="text-sm text-gray-600">PostgreSQL connected with all tables created</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-3 text-xl">✓</span>
              <div>
                <strong>Initial Data Seeded</strong>
                <p className="text-sm text-gray-600">Admin user and default categories created</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-blue-500 mr-3 text-xl">→</span>
              <div>
                <strong>Login Credentials</strong>
                <p className="text-sm text-gray-600 font-mono">admin@zoocasa.com / admin123</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href="/login"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium"
            >
              Go to Admin Login
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
