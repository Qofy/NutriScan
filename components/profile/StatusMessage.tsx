'use client';

interface StatusMessageProps {
  type: 'success' | 'error';
  message: string;
}

export default function StatusMessage({ type, message }: StatusMessageProps) {
  if (type === 'success') {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg">
        ✓ {message}
      </div>
    );
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      ✗ {message}
    </div>
  );
}
