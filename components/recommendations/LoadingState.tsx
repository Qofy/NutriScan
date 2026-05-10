'use client';

export default function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-64 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}
