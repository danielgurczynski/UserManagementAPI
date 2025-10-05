import { useState, useEffect } from 'react';
import { ExternalLink, Code, User, Shield, Key, Copy, Check, Play, BookOpen, Sun, Moon } from 'lucide-react';
import { APIPlayground } from './components/APIPlayground';
import { APIDocumentation } from './components/APIDocumentation';

const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'playground' | 'docs'>('overview');
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
  const [endpoint, setEndpoint] = useState('/auth/signup');
  const [method, setMethod] = useState('POST');
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    full_name: 'John Doe'
  }, null, 2));
  const [authToken, setAuthToken] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const endpoints = [
    { path: '/auth/signup', method: 'POST', description: 'Register new user' },
    { path: '/auth/signin', method: 'POST', description: 'Login user' },
    { path: '/auth/signout', method: 'POST', description: 'Logout user', requiresAuth: true },
    { path: '/auth/me', method: 'GET', description: 'Get current user', requiresAuth: true },
    { path: '/users', method: 'GET', description: 'Get all users', requiresAuth: true },
    { path: '/users/:id', method: 'GET', description: 'Get user by ID', requiresAuth: true },
    { path: '/users/:id', method: 'PUT', description: 'Update user profile', requiresAuth: true },
    { path: '/users/:id', method: 'DELETE', description: 'Delete user (admin)', requiresAuth: true },
  ];

  const handleTryAPI = async () => {
    setLoading(true);
    setResponse('');

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const options: RequestInit = {
        method,
        headers,
      };

      if (method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.json();

      setResponse(JSON.stringify({ status: res.status, ...data }, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: (error as Error).message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1e] text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold">User Management API</h1>
              <span className="px-4 py-1.5 bg-teal-600 text-white rounded-md text-sm font-medium">
                REST
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
            A comprehensive REST API for user authentication and profile management with JWT tokens and
            role-based access control.
          </p>
        </div>

        <div className="mb-8 flex gap-4 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'playground'
                ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Playground
            </div>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'docs'
                ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Documentation
            </div>
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold mb-6">API Description</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  A comprehensive REST API for user authentication and profile management with JWT tokens and role-based access control.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-teal-400" />
                      Authentication Endpoints
                    </h3>
                    <div className="space-y-2">
                      {endpoints.filter(e => e.path.startsWith('/auth')).map((e, i) => (
                        <div key={i} className="bg-white dark:bg-[#0a0f1e] px-4 py-3 rounded border border-gray-300 dark:border-gray-700">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2 py-1 text-xs font-bold rounded ${
                              e.method === 'GET' ? 'bg-blue-600' : 'bg-green-600'
                            }`}>
                              {e.method}
                            </span>
                            <code className="text-gray-700 dark:text-gray-300 font-mono text-sm">{e.path}</code>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm ml-16">{e.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-teal-400" />
                      User Management Endpoints
                    </h3>
                    <div className="space-y-2">
                      {endpoints.filter(e => e.path.startsWith('/users')).map((e, i) => (
                        <div key={i} className="bg-white dark:bg-[#0a0f1e] px-4 py-3 rounded border border-gray-300 dark:border-gray-700">
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2 py-1 text-xs font-bold rounded ${
                              e.method === 'GET' ? 'bg-blue-600' :
                              e.method === 'PUT' ? 'bg-yellow-600' :
                              e.method === 'DELETE' ? 'bg-red-600' : 'bg-green-600'
                            }`}>
                              {e.method}
                            </span>
                            <code className="text-gray-700 dark:text-gray-300 font-mono text-sm">{e.path}</code>
                            {e.requiresAuth && (
                              <Key className="w-3 h-3 text-yellow-400" title="Requires authentication" />
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm ml-16">{e.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold mb-6">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-1.5 bg-transparent border border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium">
                    Authentication
                  </span>
                  <span className="px-4 py-1.5 bg-transparent border border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium">
                    Users
                  </span>
                  <span className="px-4 py-1.5 bg-transparent border border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium">
                    REST
                  </span>
                  <span className="px-4 py-1.5 bg-transparent border border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium">
                    JWT
                  </span>
                  <span className="px-4 py-1.5 bg-transparent border border-teal-600 dark:border-teal-500 text-teal-600 dark:text-teal-400 rounded-full text-sm font-medium">
                    Supabase
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                    <span>JWT-based authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                    <span>Role-based access control</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                    <span>User profile management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                    <span>Secure password handling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 dark:text-teal-400 mt-1">•</span>
                    <span>Row Level Security (RLS)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : activeTab === 'playground' ? (
          <APIPlayground />
        ) : (
          <APIDocumentation />
        )}
      </div>
    </div>
  );
}

export default App;
