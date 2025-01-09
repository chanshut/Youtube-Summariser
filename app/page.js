// app/page.js
'use client';

import dynamic from 'next/dynamic';

const YouTubeSummary = dynamic(() => import('../components/YouTubeSummary'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <YouTubeSummary />
    </main>
  );
}