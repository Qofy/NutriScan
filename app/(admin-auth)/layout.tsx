export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Admin Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center font-bold text-2xl text-blue-600 mx-auto mb-4">
            N
          </div>
          <h1 className="text-3xl font-bold text-white">NutriScan</h1>
          <p className="text-blue-100 mt-2">🔐 Administrator Portal</p>
        </div>

        {/* Auth Form */}
        {children}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-blue-100 text-sm">
            © 2026 NutriScan. Secure Admin Access.
          </p>
        </div>
      </div>
    </div>
  );
}
