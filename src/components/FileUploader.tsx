'use client';

import { useState, useRef } from 'react';
import { 
  Code, Download, Copy, Check, RefreshCw, AlertCircle, 
  ThumbsUp, ChevronDown, ChevronUp, Terminal, FileCode, 
  History, Search, Zap, Eye, Upload
} from 'lucide-react';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [reviewPoints, setReviewPoints] = useState([]);
  const [codeScore, setCodeScore] = useState(null);
  const [improvedCode, setImprovedCode] = useState('');
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('review');
  const [expandedSection, setExpandedSection] = useState(null);
  const [history, setHistory] = useState([]);
  const [showDropzone, setShowDropzone] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  
  const supportedLanguages = {
    js: 'JavaScript',
    jsx: 'React JSX',
    ts: 'TypeScript',
    tsx: 'React TSX',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    cs: 'C#',
    go: 'Go',
    php: 'PHP',
    rb: 'Ruby',
    rs: 'Rust',
    swift: 'Swift',
    kt: 'Kotlin',
    html: 'HTML',
    css: 'CSS',
  };
  
  const languageIconColors = {
    JavaScript: '#f7df1e',
    'React JSX': '#61dafb',
    TypeScript: '#3178c6',
    'React TSX': '#61dafb',
    Python: '#3776ab',
    Java: '#f89820',
    'C++': '#00599c',
    'C#': '#68217a',
    Go: '#00add8',
    PHP: '#777bb4',
    Ruby: '#cc342d',
    Rust: '#f74c00',
    Swift: '#fa7343',
    Kotlin: '#7f52ff',
    HTML: '#e34c26',
    CSS: '#264de4',
  };
  
  const detectLanguage = (fileName) => {
    if (!fileName) return '';
    const extension = fileName.split('.').pop().toLowerCase();
    return supportedLanguages[extension] || extension.toUpperCase();
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    try {
      const text = await selectedFile.text();
      setFile(selectedFile);
      setFileContent(text);
      setLanguage(detectLanguage(selectedFile.name));
      setError('');
    } catch (err) {
      setError('Failed to read file content');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setShowDropzone(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      try {
        const text = await droppedFile.text();
        setFile(droppedFile);
        setFileContent(text);
        setLanguage(detectLanguage(droppedFile.name));
        setError('');
      } catch (err) {
        setError('Failed to read dropped file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        body: JSON.stringify({ 
          code: fileContent,
          language: language 
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Review request failed');
      }

      const data = await res.json();
      const raw = data.review || '';
      const improvedCode = data.improvedCode || '';

      // Extract score using regex
      const scoreMatch = raw.match(/Code Quality Score:\s*([\d.\/]+)/i);
      if (scoreMatch) {
        setCodeScore(scoreMatch[1]);
      }

      // Remove score and brackets from string and split into points
      const cleaned = raw
        .replace(/\[Code Quality Score:.*?\| Suggestions or Improvements:/, '')
        .replace(/\]$/, '');

      // Split into bullet points and clean up
      const points = cleaned
        .split(/\*\s|\n\s*-\s*/)
        .map((p) => p.replace(/\*\*/g, '').replace(/^\*+/, '').trim())
        .filter((p) => p.length > 0);

      setReviewPoints(points);
      setImprovedCode(improvedCode);
      
      // Add to history
      setHistory(prev => [
        { 
          filename: file.name, 
          language: language,
          timestamp: new Date().toLocaleString(),
          score: scoreMatch ? scoreMatch[1] : 'N/A'
        }, 
        ...prev.slice(0, 9)
      ]);
    } catch (err) {
      setError('Failed to review code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImprovedCode = () => {
    if (!improvedCode) return;
    
    const element = document.createElement('a');
    const file = new Blob([improvedCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `improved_${file?.name || 'code.txt'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const clearForm = () => {
    setFile(null);
    setFileContent('');
    setReviewPoints([]);
    setCodeScore(null);
    setImprovedCode('');
    setLanguage('');
    setActiveTab('review');
    setExpandedSection(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score) => {
    if (!score) return 'bg-gray-600';
    const numScore = parseFloat(score);
    if (numScore >= 8) return 'bg-emerald-500';
    if (numScore >= 6) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score) => {
    if (!score) return 'text-gray-400';
    const numScore = parseFloat(score);
    if (numScore >= 8) return 'text-emerald-500';
    if (numScore >= 6) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-cyan-400 flex items-center gap-2">
            <Terminal className="text-cyan-400" />
            <span>CodeReview</span>
            <span className="text-sm bg-cyan-900 text-cyan-300 px-2 py-0.5 rounded ml-2">Pro</span>
          </h1>
          <div className="text-sm text-gray-400">Powered by AI</div>
        </div>
        
        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md flex items-center">
            <AlertCircle className="mr-2 flex-shrink-0" size={18} />
            <p>{error}</p>
          </div>
        )}

        {/* Upload panel */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-6 overflow-hidden shadow-xl">
          <div className="border-b border-gray-700 px-6 py-4 flex items-center">
            <FileCode className="mr-2 text-cyan-400" size={20} />
            <h2 className="text-xl font-semibold">Upload Code</h2>
          </div>
          
          <div className="p-6">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer transition-all ${
                showDropzone 
                  ? 'border-cyan-500/70 bg-cyan-900/20' 
                  : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setShowDropzone(true);
              }}
              onDragLeave={() => setShowDropzone(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.cs,.go,.php,.rb,.rs,.swift,.kt,.html,.css"
              />
              <div className="flex flex-col items-center justify-center">
                <Upload size={36} className="text-cyan-400 mb-3" />
                <p className="text-gray-300 mb-2">
                  {file ? file.name : "Drag code file here or click to browse"}
                </p>
                {language && (
                  <span 
                    className="inline-flex items-center gap-1.5 bg-gray-700 px-2.5 py-1 rounded text-sm"
                    style={{
                      borderLeft: `3px solid ${languageIconColors[language] || '#64748b'}`
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languageIconColors[language] || '#64748b' }}></span>
                    {language}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`flex-1 px-5 py-3 rounded-md flex items-center justify-center transition-colors ${
                  loading || !file
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-cyan-700 hover:bg-cyan-600 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 animate-spin" size={18} />
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2" size={18} />
                    Review Code
                  </>
                )}
              </button>
              
              <button
                onClick={clearForm}
                className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-5 py-3 rounded-md transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results section */}
        {(reviewPoints.length > 0 || improvedCode) && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-xl">
            <div className="flex border-b border-gray-700">
              <button 
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'review' 
                    ? 'bg-gray-700 border-b-2 border-cyan-500 text-cyan-400' 
                    : 'text-gray-400 hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveTab('review')}
              >
                <Eye size={18} />
                Review Results
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'improved' 
                    ? 'bg-gray-700 border-b-2 border-cyan-500 text-cyan-400' 
                    : 'text-gray-400 hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveTab('improved')}
              >
                <Code size={18} />
                Improved Code
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'history' 
                    ? 'bg-gray-700 border-b-2 border-cyan-500 text-cyan-400' 
                    : 'text-gray-400 hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveTab('history')}
              >
                <History size={18} />
                History
              </button>
            </div>

            {activeTab === 'review' && (
              <div className="p-6">
                {codeScore && (
                  <div className="mb-6 bg-gray-750 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium text-gray-200 mb-3">Code Quality Score</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${getScoreColor(codeScore)}`}
                          style={{ width: `${Math.min(parseFloat(codeScore) * 10, 100)}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold text-xl ${getScoreTextColor(codeScore)}`}>
                        {codeScore}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-200">Suggestions & Improvements</h3>
                    <span className="text-sm text-gray-400 bg-gray-700 px-2 py-0.5 rounded">
                      {reviewPoints.length} {reviewPoints.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {reviewPoints.map((point, idx) => {
                      const isExpanded = expandedSection === idx;
                      const shouldTruncate = point.length > 100;
                      
                      return (
                        <div 
                          key={idx} 
                          className="border border-gray-700 rounded-md hover:bg-gray-750 transition-colors bg-gray-800"
                        >
                          <div 
                            className="flex items-start p-3 cursor-pointer group"
                            onClick={() => shouldTruncate && toggleSection(idx)}
                          >
                            <div className="mr-3 mt-1 text-cyan-500">
                              {shouldTruncate ? (
                                isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />
                              ) : (
                                <ThumbsUp size={18} />
                              )}
                            </div>
                            <div className="flex-1 text-gray-300">
                              {shouldTruncate && !isExpanded 
                                ? point.substring(0, 100) + '...' 
                                : point}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'improved' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-200">Optimized Code</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(improvedCode)}
                      className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded transition-colors"
                    >
                      {copied ? <Check size={16} className="mr-1.5" /> : <Copy size={16} className="mr-1.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button 
                      onClick={downloadImprovedCode}
                      className="flex items-center text-sm bg-cyan-900 hover:bg-cyan-800 text-cyan-300 px-3 py-1.5 rounded transition-colors"
                    >
                      <Download size={16} className="mr-1.5" />
                      Download
                    </button>
                  </div>
                </div>
                
                <div className="relative rounded-md overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 bg-gray-900 text-gray-400 text-xs px-4 py-1 flex justify-between">
                    <span>Improved code</span>
                    <span>{language}</span>
                  </div>
                  <pre className="bg-gray-900 text-gray-100 p-4 pt-8 rounded-md overflow-auto whitespace-pre max-h-96 font-mono text-sm leading-relaxed border border-gray-700">
                    <code>{improvedCode || '// No improved code available'}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-200">Recent Reviews</h3>
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search history..."
                      className="bg-gray-700 border border-gray-600 rounded py-1.5 pl-8 pr-3 text-sm text-gray-300 w-48 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>
                
                {history.length === 0 ? (
                  <div className="text-gray-400 italic p-8 text-center bg-gray-750 rounded-md border border-gray-700">
                    No review history yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {history.map((item, idx) => (
                      <div key={idx} className="py-3 px-4 flex justify-between items-center hover:bg-gray-750 transition-colors">
                        <div>
                          <p className="font-medium text-gray-200">{item.filename}</p>
                          <div className="flex items-center text-sm text-gray-400 mt-1">
                            <span 
                              className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded mr-2 bg-gray-700"
                              style={{
                                borderLeft: `2px solid ${languageIconColors[item.language] || '#64748b'}`
                              }}
                            >
                              {item.language}
                            </span>
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                        <div>
                          <span className={`font-bold ${getScoreTextColor(item.score)}`}>
                            {item.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>CodeReview Pro ©2025 • Built with Next.js</p>
        </div>
      </div>
    </div>
  );
}