import { useState, useEffect } from 'react';
import { ExternalLink, FileText, Code, Tag, BookOpen, Sun, Moon } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export function BlogPostsAPI() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1e] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold">Blog Posts API</h1>
              <span className="px-4 py-1.5 bg-teal-600 text-white rounded-md text-sm font-medium">
                GET
              </span>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            A content management API for creating, reading, updating, and deleting blog posts with markdown support and tag filtering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-6">API Description</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                A content management API for creating, reading, updating, and deleting blog posts with markdown support and tag filtering.
              </p>

              <div>
                <h3 className="text-lg font-semibold mb-4">Endpoint</h3>
                <div className="bg-white dark:bg-[#0a0f1e] px-4 py-3 rounded border border-gray-300 dark:border-gray-700">
                  <code className="text-teal-600 dark:text-teal-400 font-mono text-sm">/api/posts</code>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-6">Tags</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1.5 bg-transparent border border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium">
                  Content
                </span>
                <span className="px-4 py-1.5 bg-transparent border border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium">
                  Blog
                </span>
                <span className="px-4 py-1.5 bg-transparent border border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium">
                  Markdown
                </span>
                <span className="px-4 py-1.5 bg-transparent border border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium">
                  CMS
                </span>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Links</h2>
              <a
                href={`${API_BASE_URL}/posts`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Try API
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
