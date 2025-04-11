'use client';

import { useState } from 'react';

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [reviewPoints, setReviewPoints] = useState<string[]>([]);
  const [codeScore, setCodeScore] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const text = await file.text();
    setLoading(true);

    const res = await fetch('/api/review', {
      method: 'POST',
      body: JSON.stringify({ code: text }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    const raw = data.review || '';

    // Extract score using regex
    const scoreMatch = raw.match(/Code Quality Score:\s*([\d.\/]+)/i);
    if (scoreMatch) {
      setCodeScore(scoreMatch[1]);
    }

    // Remove score and brackets from string
    const cleaned = raw.replace(/\[Code Quality Score:.*?\| Suggestions or Improvements:/, '')
                       .replace(/\]$/, '');

    // Split into bullet points and clean up
    const points = cleaned
      .split(/\*\s|\n\s*-\s*/) // Split on bullet-like markers
      .map((p) =>
        p.replace(/\*\*/g, '') // remove any bold markdown
         .replace(/^\*+/, '') // remove stray leading *
         .trim()
      )
      .filter((p) => p.length > 0);

    setReviewPoints(points);
    setLoading(false);
  };

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-2xl mx-auto bg-white space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Code Review Bot</h2>

      <input
        type="file"
        accept=".js,.ts,.py,.cpp,.java,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
        file:rounded file:border-0 file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Reviewing...' : 'Review Code'}
      </button>

      {reviewPoints.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          {codeScore && (
            <p className="text-sm text-gray-600 mb-2">
              <strong>Code Quality Score:</strong> {codeScore}
            </p>
          )}
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Suggestions & Improvements:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {reviewPoints.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}