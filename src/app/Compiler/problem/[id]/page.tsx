'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { useRouter } from 'next/navigation';
import { problem as problemData } from '../../Components/problems';



export default function ProblemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editorState, setEditorState] = useState<EditorState>({
    language: 'javascript',
    code: '',
  });
  
  const [activeTab, setActiveTab] = useState<'description' | 'submissions' | 'testcases'>('description');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [console, setConsole] = useState<ConsoleEntry[]>([]);
  const [submissions, setSubmissions] = useState<{
    id: string;
    timestamp: number;
    status: 'success' | 'error';
    language: string;
  }[]>([]);
  const [showOutputPanel, setShowOutputPanel] = useState(true);
  const [outputPanelHeight, setOutputPanelHeight] = useState(300);
  const [consoleView, setConsoleView] = useState<'console' | 'result'>('console');

  useEffect(() => {
    if (!id) return;

    const fetchProblem = async () => {
      try {
        // Replace with actual API call in production
        // const response = await fetch(`/api/problems/${id}`);
        // const data = await response.json();
        const data = problemData && problemData.find((p) => p.id === id) || null;
        setProblem(data);
        setEditorState({
          language: 'python',
          code: data?.starterCode?.python || '',
        });
        
        // Add welcome message to console
        setConsole([{
          type: 'info',
          content: `Welcome to the coding environment! You're working on "${data?.name}". Run your code to see the output here.`,
          timestamp: Date.now()
        }]);
        
        // Mock fetch submissions (replace with actual API call)
        // const submissionsResponse = await fetch(`/api/submissions?problemId=${id}`);
        // const submissionsData = await submissionsResponse.json();
        // setSubmissions(submissionsData);
      } catch (error) {
        addToConsole('error', 'Failed to load problem data');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleLanguageChange = (language: string) => {
    if (problem?.starterCode[language]) {
      setEditorState({
        language,
        code: problem.starterCode[language],
      });
      addToConsole('info', `Switched language to ${language}`);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorState({ ...editorState, code: value });
    }
  };
  
  const addToConsole = (type: 'input' | 'output' | 'error' | 'info', content: string) => {
    setConsole(prev => [
      ...prev, 
      { 
        type,
        content,
        timestamp: Date.now()
      }
    ]);
  };

  const runCode = async (isSubmission = false) => {
    setIsSubmitting(true);
    setConsoleView('console');
    setResult(null);
  
    if (console.length > 50) {
      setConsole(prev => prev.slice(-30));
    }
  
    try {
      const payload = {
        source_code: editorState.code,
        language_id: getLanguageId(editorState.language),
        stdin: isSubmission ? '' : customInput,
      };
  
      addToConsole('input', `Running ${editorState.language} code with ${isSubmission ? 'test cases' : 'custom input'}...`);
  
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': '2195aada2cmsh9c3700ff279885cp1cf1f5jsn3c45763f080d',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const resultObj: SubmissionResult = {
          status: data.status.id === 3 ? 'success' : 'error',
          output: data.stdout,
          error: data.stderr || data.compile_output,
          executionTime: data.time,
          memory: data.memory,
        };
  
        setResult(resultObj);
        addToConsole('output', data.stdout || data.stderr || data.compile_output);
      } else {
        addToConsole('error', 'Failed to execute code.');
      }
  
    } catch (error) {
      // console.error(error);
      if (error instanceof Error) {
        addToConsole('error', error.message);
      } else {
        addToConsole('error', 'An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to get Judge0 language ID
  const getLanguageId = (language: string): number => {
    const languageMap: {[key: string]: number} = {
      'javascript': 63, // Node.js
      'python': 71,    // Python 3
      'java': 62,      // Java
      'cpp': 54,       // C++
      'c': 50,         // C
      'ruby': 72,      // Ruby
      'php': 68,       // PHP
      'typescript': 74, // TypeScript
      'go': 60,        // Go
      'rust': 73       // Rust
    };
    return languageMap[language] || 63; // Default to JavaScript
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString([], { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  };

  const renderDifficultyBadge = (difficulty: string) => {
    const colors = {
      'easy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'hard': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty.toLowerCase() as 'easy' | 'medium' | 'hard']}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  const toggleOutputPanel = () => {
    setShowOutputPanel(!showOutputPanel);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Problem Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">The problem you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to All Problems
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center px-6">
        <div className="flex-1">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to Problems
          </button>
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{problem.name}</h1>
          <span className="ml-3">
            {problem.difficulty && renderDifficultyBadge(problem.difficulty)}
          </span>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="relative">
            <select
              value={editorState.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-500"
            >
              {Object.keys(problem.starterCode).map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)]">
        {/* Left Panel: Problem description & tabs */}
        <div className="w-full md:w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-3 px-6 font-medium ${
                activeTab === 'description'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('testcases')}
              className={`py-3 px-6 font-medium ${
                activeTab === 'testcases'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-3 px-6 font-medium ${
                activeTab === 'submissions'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Submissions
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            {activeTab === 'description' && (
              <div className="py-6 px-6 prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-line">{problem.description}</div>
                
                <h3 className="text-lg font-medium mt-8 mb-4">Examples</h3>
                <div className="space-y-6">
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Input:</span>
                        <pre className="mt-1 bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto">
                          {example.input}
                        </pre>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Output:</span>
                        <pre className="mt-1 bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto">
                          {example.output}
                        </pre>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Explanation:</span>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-medium mt-8 mb-4">Constraints</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {problem.constraints.map((constraint, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">
                      {constraint}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'testcases' && (
              <div className="py-6 px-6">
                <h3 className="text-lg font-medium mb-4">Test Cases</h3>
                
                <div className="space-y-6">
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Test Case {idx + 1}
                        </span>
                        <button 
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm"
                          onClick={() => setCustomInput(example.input)}
                        >
                          Use as Custom Input
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="mb-3">
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input:</span>
                          <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto max-h-32">
                            {example.input}
                          </pre>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Output:</span>
                          <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto max-h-32">
                            {example.output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <h4 className="text-md font-medium text-blue-800 dark:text-blue-300 mb-2">Tips for Testing</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-400">
                    <li>Ensure your code handles all edge cases</li>
                    <li>Test with minimum and maximum input sizes from constraints</li>
                    <li>Consider time and space complexity requirements</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="py-6 px-6">
                <h3 className="text-lg font-medium mb-4">Your Submission History</h3>
                
                {submissions.length === 0 ? (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center">
                    <svg className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">
                      No submissions yet. Submit your solution to see your history here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Language</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {submissions.map((submission) => (
                          <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {formatDate(submission.timestamp)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                submission.status === 'success'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                              }`}>
                                {submission.status === 'success' ? 'Accepted' : 'Failed'}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                              {submission.language.charAt(0).toUpperCase() + submission.language.slice(1)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code editor and console */}
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Code editor */}
          <div className="flex-grow">
            <Editor
              height="100%"
              language={editorState.language}
              value={editorState.code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 2,
                automaticLayout: true,
                lineNumbers: "on",
                rulers: [80],
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Resizable handle */}
          <div 
            className="h-1 cursor-ns-resize bg-gray-300 dark:bg-gray-700 hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
            onMouseDown={(e) => {
              const startY = e.clientY;
              const startHeight = outputPanelHeight;
              
                const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaY = startY - moveEvent.clientY;
                const newHeight = Math.min(Math.max(startHeight + deltaY, 150), window.innerHeight / 2);
                setOutputPanelHeight(newHeight);
                };
              
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />

          {/* Output panel */}
          <div 
            className={`border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out ${
              showOutputPanel ? 'flex flex-col' : 'h-10'
            }`}
            style={{ height: showOutputPanel ? outputPanelHeight : 40 }}
          >
            {/* Output panel header */}
            <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex items-center space-x-4">
                <button
                  onClick={() => setConsoleView('console')}
                  className={`font-medium ${
                    consoleView === 'console'
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  Console
                </button>
                {result && (
                  <button
                    onClick={() => setConsoleView('result')}
                    className={`font-medium ${
                      consoleView === 'result'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`}
                  >
                    Results
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setConsole([])}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={toggleOutputPanel}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showOutputPanel ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {showOutputPanel && (
              <>
                {/* Console panel */}
                {consoleView === 'console' && (
                  <div className="flex-grow overflow-y-auto p-4 font-mono text-sm">
                    {console.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 italic">
                      <svg className="h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p>Run your code to see output here</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {console.map((entry, idx) => (
                        <div
                          key={idx}
                          className={`py-1 ${
                            entry.type === 'error'
                              ? 'text-red-600 dark:text-red-400'
                              : entry.type === 'output'
                              ? 'text-green-600 dark:text-green-400'
                              : entry.type === 'info'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span className="text-xs text-gray-500 dark:text-gray-500 mr-2">[{formatTimestamp(entry.timestamp)}]</span>
                          {entry.type === 'input' && '> '}
                          <pre className="whitespace-pre-wrap inline">{entry.content}</pre>
                        </div>
                      ))}
                      <div ref={el => { if (el) el.scrollIntoView({ behavior: 'smooth' }); }} />
                    </div>
                  )}
                </div>
              )}
              
              {/* Results panel */}
              {consoleView === 'result' && result && (
                <div className="flex-grow overflow-y-auto">
                  <div className="p-4">
                    <div className="mb-4 flex items-center">
                      <div className={`h-4 w-4 rounded-full mr-2 ${
                        result.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <h3 className="font-medium text-lg">
                        {result.status === 'success' ? 'Execution Successful' : 'Execution Failed'}
                      </h3>
                    </div>
                    
                    {result.executionTime !== undefined && (
                      <div className="flex space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Time:</span> {result.executionTime} s
                        </div>
                        {result.memory && (
                          <div>
                            <span className="font-medium">Memory:</span> {result.memory} KB
                          </div>
                        )}
                      </div>
                    )}
                    
                    {result.testCases ? (
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Test Cases</h4>
                        {result.testCases.map((tc, idx) => (
                          <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div className={`px-4 py-2 flex items-center justify-between ${
                              tc.passed 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            }`}>
                              <span className="font-medium">
                                Test Case {idx + 1}: {tc.passed ? 'Passed' : 'Failed'}
                              </span>
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {tc.passed ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                )}
                              </svg>
                            </div>
                            <div className="p-3 text-sm">
                              <div className="mb-2">
                                <span className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Input:</span>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">{tc.input}</pre>
                              </div>
                              <div className="mb-2">
                                <span className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Output:</span>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">{tc.expectedOutput}</pre>
                              </div>
                              <div className="mb-2">
                                <span className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Your Output:</span>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">{tc.actualOutput}</pre>
                              </div>
                              {tc.error && (
                                <div>
                                  <span className="block font-medium text-red-600 dark:text-red-400 mb-1">Error:</span>
                                  <pre className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-2 rounded overflow-x-auto">{tc.error}</pre>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {result.output && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Output</h4>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto max-h-60 text-sm">
                              {result.output}
                            </pre>
                          </div>
                        )}
                        
                        {result.error && (
                          <div>
                            <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Error</h4>
                            <pre className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-lg overflow-x-auto max-h-60 text-sm">
                              {result.error}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Controls & Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Custom Input
                  </label>
                  <textarea
                    className="w-full h-20 px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 font-mono text-sm resize-none"
                    placeholder="Enter your custom input here..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => runCode(false)}
                    disabled={isSubmitting}
                    className={`flex-1 flex justify-center items-center ${
                      isSubmitting 
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    } text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800 dark:text-gray-200" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Running...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Run Code
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => runCode(true)}
                    disabled={isSubmitting}
                    className={`flex-1 flex justify-center items-center ${
                      isSubmitting
                        ? 'bg-indigo-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white font-medium py-2 px-4 rounded-lg transition-colors`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
                        