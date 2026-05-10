'use client';

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      {message}
    </div>
  );
}
