'use client';

import { useState } from 'react';

export default function QuizBotPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quiz, setQuiz] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');
    setQuiz('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, 'Type:', file.type);
      
      const res = await fetch('/api/quiz', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.quiz || data.quiz === 'No content returned') {
        throw new Error('No quiz content was generated. Please try a different file or check server logs.');
      }

      setQuiz(data.quiz);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error generating quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Upload Notes Image to Generate Quiz</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept="image/*, application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <p className="mt-1 text-sm text-gray-500">
          Supported formats: Images (JPG, PNG) and PDF files
        </p>
      </div>
      
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`px-4 py-2 rounded font-medium ${
          loading || !file
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white w-full transition-colors`}
      >
        {loading ? 'Generating Quiz...' : 'Generate Quiz'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center">
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
            <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
            <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
          </div>
          <p className="mt-2 text-gray-600">Analyzing notes and generating quiz...</p>
        </div>
      )}

      {quiz && (
        <div className="mt-5 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h3 className="font-semibold mb-2 text-lg">Generated Quiz:</h3>
          <div className="whitespace-pre-wrap">{quiz}</div>
        </div>
      )}
    </div>
  );
}