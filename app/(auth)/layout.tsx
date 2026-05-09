export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-600">NutriScan</h1>
          <p className="text-gray-600 mt-2">AI Health Advisor</p>
        </div>
        {children}
      </div>
    </div>
  );
}
