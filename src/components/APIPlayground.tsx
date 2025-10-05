import { useState } from 'react';
import { Copy, Check, Play } from 'lucide-react';

const API_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

interface EndpointConfig {
  path: string;
  method: string;
  description: string;
  requiresAuth: boolean;
  exampleBody?: object;
}

const endpoints: EndpointConfig[] = [
  {
    path: '/auth/signup',
    method: 'POST',
    description: 'Register new user',
    requiresAuth: false,
    exampleBody: {
      email: 'demo@example.com',
      password: 'SecurePass123!',
      full_name: 'Demo User',
    },
  },
  {
    path: '/auth/signin',
    method: 'POST',
    description: 'Login user',
    requiresAuth: false,
    exampleBody: {
      email: 'demo@example.com',
      password: 'SecurePass123!',
    },
  },
  {
    path: '/auth/signout',
    method: 'POST',
    description: 'Logout user',
    requiresAuth: true,
  },
  {
    path: '/auth/me',
    method: 'GET',
    description: 'Get current user',
    requiresAuth: true,
  },
  {
    path: '/users',
    method: 'GET',
    description: 'Get all users',
    requiresAuth: true,
  },
  {
    path: '/users/:id',
    method: 'GET',
    description: 'Get user by ID',
    requiresAuth: true,
  },
  {
    path: '/users/:id',
    method: 'PUT',
    description: 'Update user profile',
    requiresAuth: true,
    exampleBody: {
      full_name: 'Updated Name',
      bio: 'Software developer and API enthusiast',
    },
  },
  {
    path: '/users/:id',
    method: 'DELETE',
    description: 'Delete user (admin)',
    requiresAuth: true,
  },
];

export function APIPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [requestBody, setRequestBody] = useState(
    JSON.stringify(endpoints[0].exampleBody || {}, null, 2)
  );
  const [authToken, setAuthToken] = useState('');
  const [userId, setUserId] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const handleEndpointChange = (endpoint: EndpointConfig) => {
    setSelectedEndpoint(endpoint);
    setRequestBody(JSON.stringify(endpoint.exampleBody || {}, null, 2));
  };

  const handleCopy = (text: string, type: 'request' | 'response') => {
    navigator.clipboard.writeText(text);
    if (type === 'request') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const buildUrl = () => {
    let path = selectedEndpoint.path;
    if (path.includes(':id') && userId) {
      path = path.replace(':id', userId);
    }
    return `${API_BASE_URL}${path}`;
  };

  const buildCurlCommand = () => {
    const url = buildUrl();
    let curl = `curl -X ${selectedEndpoint.method} '${url}' \\\n`;
    curl += `  -H 'Content-Type: application/json'`;

    if (authToken) {
      curl += ` \\\n  -H 'Authorization: Bearer ${authToken}'`;
    }

    if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
      curl += ` \\\n  -d '${requestBody}'`;
    }

    return curl;
  };

  const handleExecute = async () => {
    setLoading(true);
    setResponse('');

    try {
      const url = buildUrl();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      };

      if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.json();

      const responseData = {
        status: res.status,
        statusText: res.statusText,
        data,
      };

      setResponse(JSON.stringify(responseData, null, 2));

      if (selectedEndpoint.path === '/auth/signup' || selectedEndpoint.path === '/auth/signin') {
        if (data.session?.access_token) {
          setAuthToken(data.session.access_token);
        }
        if (data.user?.id) {
          setUserId(data.user.id);
        }
      }
    } catch (error) {
      setResponse(
        JSON.stringify(
          {
            error: 'Request failed',
            message: (error as Error).message,
          },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Configure Request</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Select Endpoint
              </label>
              <select
                value={`${selectedEndpoint.method}:${selectedEndpoint.path}`}
                onChange={(e) => {
                  const [method, ...pathParts] = e.target.value.split(':');
                  const path = pathParts.join(':');
                  const endpoint = endpoints.find(
                    (ep) => ep.method === method && ep.path === path
                  );
                  if (endpoint) handleEndpointChange(endpoint);
                }}
                className="w-full bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {endpoints.map((e, i) => (
                  <option key={i} value={`${e.method}:${e.path}`}>
                    {e.method} {e.path} - {e.description}
                  </option>
                ))}
              </select>
            </div>

            {selectedEndpoint.path.includes(':id') && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user ID or login to auto-fill"
                  className="w-full bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">
                  Sign up or sign in first to get a user ID automatically
                </p>
              </div>
            )}

            {selectedEndpoint.requiresAuth && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Auth Token {!authToken && <span className="text-red-400">(Required)</span>}
                </label>
                <input
                  type="text"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="Sign up or sign in to get token"
                  className="w-full bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-600 dark:text-gray-500 mt-1">
                  JWT token will be auto-filled after successful login
                </p>
              </div>
            )}

            {selectedEndpoint.method !== 'GET' && (
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Request Body (JSON)
                </label>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  rows={10}
                  className="w-full bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            <button
              onClick={handleExecute}
              disabled={loading || (selectedEndpoint.requiresAuth && !authToken)}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {loading ? 'Executing...' : 'Execute Request'}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">cURL Command</h3>
            <button
              onClick={() => handleCopy(buildCurlCommand(), 'request')}
              className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#0a0f1e] hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-300 font-mono text-xs overflow-x-auto">
            {buildCurlCommand()}
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Response</h3>
            {response && (
              <button
                onClick={() => handleCopy(response, 'response')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#0a0f1e] hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 transition-colors"
              >
                {copiedResponse ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copiedResponse ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

          {response ? (
            <pre className="bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-300 font-mono text-sm overflow-x-auto max-h-[600px]">
              {response}
            </pre>
          ) : (
            <div className="bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-12 text-center">
              <div className="text-gray-600 dark:text-gray-500 mb-2">No response yet</div>
              <div className="text-sm text-gray-700 dark:text-gray-600">
                Execute a request to see the response
              </div>
            </div>
          )}
        </div>

        {!authToken && (
          <div className="bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/20 dark:to-blue-900/20 border border-teal-300 dark:border-teal-800/50 rounded-lg p-6">
            <h4 className="font-semibold text-teal-700 dark:text-teal-400 mb-2">Quick Start Guide</h4>
            <ol className="space-y-2 text-sm text-gray-800 dark:text-gray-300">
              <li className="flex gap-2">
                <span className="text-teal-700 dark:text-teal-400 font-bold">1.</span>
                <span>Select POST /auth/signup and click Execute to create an account</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-700 dark:text-teal-400 font-bold">2.</span>
                <span>Your auth token will be automatically saved</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal-700 dark:text-teal-400 font-bold">3.</span>
                <span>Try other endpoints that require authentication</span>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
