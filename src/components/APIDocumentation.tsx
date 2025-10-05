import { useState } from 'react';
import { Copy, Check, Shield, User, Lock, Database } from 'lucide-react';

export function APIDocumentation() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const CodeBlock = ({
    code,
    language,
    section,
  }: {
    code: string;
    language: string;
    section: string;
  }) => (
    <div className="relative group">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="text-xs text-gray-600 dark:text-gray-500 uppercase">{language}</span>
        <button
          onClick={() => handleCopy(code, section)}
          className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-white dark:bg-[#0a0f1e] hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1"
        >
          {copiedSection === section ? (
            <>
              <Check className="w-3 h-3" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-300 font-mono text-sm overflow-x-auto">
        {code}
      </pre>
    </div>
  );

  return (
    <div className="max-w-5xl">
      <div className="space-y-8">
        <section className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            This User Management API provides a complete solution for authentication and user profile
            management. All endpoints return JSON responses and use JWT tokens for authentication.
          </p>

          <div className="bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-2">Base URL</h3>
            <code className="text-gray-900 dark:text-gray-300 text-sm">
              {import.meta.env.VITE_SUPABASE_URL}/functions/v1
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <Shield className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-2" />
              <h4 className="font-semibold mb-1">JWT Auth</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Secure token-based authentication
              </p>
            </div>
            <div className="bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <Lock className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-2" />
              <h4 className="font-semibold mb-1">RBAC</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Role-based access control</p>
            </div>
            <div className="bg-white dark:bg-[#0a0f1e] border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <Database className="w-8 h-8 text-teal-600 dark:text-teal-400 mb-2" />
              <h4 className="font-semibold mb-1">RLS</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Row level security policies</p>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <h2 className="text-2xl font-bold">Authentication</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">
                  POST
                </span>
                <code className="text-lg font-mono">/auth/signup</code>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Register a new user account.</p>

              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Request Body</h4>
              <CodeBlock
                section="signup-request"
                language="json"
                code={`{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe"
}`}
              />

              <h4 className="text-sm font-semibold text-gray-400 mb-2 mt-4">Response (201)</h4>
              <CodeBlock
                section="signup-response"
                language="json"
                code={`{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "created_at": "2025-10-05T12:00:00Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600
  },
  "message": "User registered successfully"
}`}
              />

              <h4 className="text-sm font-semibold text-gray-400 mb-2 mt-4">cURL Example</h4>
              <CodeBlock
                section="signup-curl"
                language="bash"
                code={`curl -X POST '${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth/signup' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "full_name": "John Doe"
  }'`}
              />
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">
                  POST
                </span>
                <code className="text-lg font-mono">/auth/signin</code>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Authenticate and receive a JWT token.</p>

              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Request Body</h4>
              <CodeBlock
                section="signin-request"
                language="json"
                code={`{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}`}
              />

              <h4 className="text-sm font-semibold text-gray-400 mb-2 mt-4">Response (200)</h4>
              <CodeBlock
                section="signin-response"
                language="json"
                code={`{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1.MR...",
    "token_type": "bearer",
    "expires_in": 3600
  },
  "message": "Login successful"
}`}
              />
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded">
                  POST
                </span>
                <code className="text-lg font-mono">/auth/signout</code>
                <span className="text-xs px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded border border-yellow-700">
                  Auth Required
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Sign out the current user.</p>

              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Headers</h4>
              <CodeBlock
                section="signout-headers"
                language="text"
                code={`Authorization: Bearer <access_token>`}
              />

              <h4 className="text-sm font-semibold text-gray-400 mb-2 mt-4">Response (200)</h4>
              <CodeBlock
                section="signout-response"
                language="json"
                code={`{
  "message": "Logout successful"
}`}
              />
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                  GET
                </span>
                <code className="text-lg font-mono">/auth/me</code>
                <span className="text-xs px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded border border-yellow-700">
                  Auth Required
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get the current authenticated user.</p>

              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Response (200)</h4>
              <CodeBlock
                section="me-response"
                language="json"
                code={`{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "created_at": "2025-10-05T12:00:00Z",
    "updated_at": "2025-10-05T12:00:00Z"
  }
}`}
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <h2 className="text-2xl font-bold">User Management</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                  GET
                </span>
                <code className="text-lg font-mono">/users</code>
                <span className="text-xs px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded border border-yellow-700">
                  Auth Required
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get a list of all users.</p>

              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Response (200)</h4>
              <CodeBlock
                section="users-list-response"
                language="json"
                code={`{
  "users": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user1@example.com",
      "full_name": "John Doe",
      "role": "user",
      "avatar_url": null,
      "bio": null,
      "created_at": "2025-10-05T12:00:00Z",
      "updated_at": "2025-10-05T12:00:00Z"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "email": "admin@example.com",
      "full_name": "Jane Smith",
      "role": "admin",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "System administrator",
      "created_at": "2025-10-05T11:00:00Z",
      "updated_at": "2025-10-05T11:00:00Z"
    }
  ]
}`}
              />
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                  GET
                </span>
                <code className="text-lg font-mono">/users/:id</code>
                <span className="text-xs px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded border border-yellow-700">
                  Auth Required
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get a specific user by ID.</p>

              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Response (200)</h4>
              <CodeBlock
                section="user-get-response"
                language="json"
                code={`{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "avatar_url": null,
    "bio": "Software developer passionate about APIs",
    "created_at": "2025-10-05T12:00:00Z",
    "updated_at": "2025-10-05T12:30:00Z"
  }
}`}
              />
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-yellow-600 text-white text-xs font-bold rounded">
                  PUT
                </span>
                <code className="text-lg font-mono">/users/:id</code>
                <span className="text-xs px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded border border-yellow-700">
                  Auth Required
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Update a user profile. Users can update their own profile, admins can update any
                profile.
              </p>

              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Request Body</h4>
              <CodeBlock
                section="user-update-request"
                language="json"
                code={`{
  "full_name": "John Updated Doe",
  "bio": "Full-stack developer and API enthusiast",
  "avatar_url": "https://example.com/new-avatar.jpg"
}`}
              />

              <h4 className="text-sm font-semibold text-gray-400 mb-2 mt-4">Response (200)</h4>
              <CodeBlock
                section="user-update-response"
                language="json"
                code={`{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "full_name": "John Updated Doe",
    "role": "user",
    "avatar_url": "https://example.com/new-avatar.jpg",
    "bio": "Full-stack developer and API enthusiast",
    "created_at": "2025-10-05T12:00:00Z",
    "updated_at": "2025-10-05T13:00:00Z"
  },
  "message": "Profile updated successfully"
}`}
              />
            </div>

            <div className="border-t border-gray-700 pt-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded">
                  DELETE
                </span>
                <code className="text-lg font-mono">/users/:id</code>
                <span className="text-xs px-2 py-1 bg-red-900/50 text-red-400 rounded border border-red-700">
                  Admin Only
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Delete a user. Only administrators can perform this action.
              </p>

              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Response (200)</h4>
              <CodeBlock
                section="user-delete-response"
                language="json"
                code={`{
  "message": "User deleted successfully"
}`}
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-[#141b2e] rounded-lg p-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Error Responses</h2>
          <p className="text-gray-300 mb-6">
            The API uses standard HTTP status codes and returns error details in JSON format.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">400 Bad Request</h4>
              <CodeBlock
                section="error-400"
                language="json"
                code={`{
  "error": "Email and password are required"
}`}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">401 Unauthorized</h4>
              <CodeBlock
                section="error-401"
                language="json"
                code={`{
  "error": "Invalid credentials"
}`}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">403 Forbidden</h4>
              <CodeBlock
                section="error-403"
                language="json"
                code={`{
  "error": "Forbidden: Admin access required"
}`}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">404 Not Found</h4>
              <CodeBlock
                section="error-404"
                language="json"
                code={`{
  "error": "User not found"
}`}
              />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/20 dark:to-blue-900/20 border border-teal-300 dark:border-teal-800/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Client Libraries</h2>
          <p className="text-gray-800 dark:text-gray-300 mb-6">
            Use these examples to integrate the API with your favorite programming language.
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-2">JavaScript / TypeScript</h4>
              <CodeBlock
                section="js-example"
                language="javascript"
                code={`// Sign up a new user
const response = await fetch('${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123!',
    full_name: 'John Doe'
  })
});

const data = await response.json();
const token = data.session.access_token;

// Use the token for authenticated requests
const usersResponse = await fetch('${import.meta.env.VITE_SUPABASE_URL}/functions/v1/users', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});

const users = await usersResponse.json();`}
              />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-2">Python</h4>
              <CodeBlock
                section="python-example"
                language="python"
                code={`import requests

# Sign up a new user
response = requests.post(
    '${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth/signup',
    json={
        'email': 'user@example.com',
        'password': 'SecurePassword123!',
        'full_name': 'John Doe'
    }
)

data = response.json()
token = data['session']['access_token']

# Use the token for authenticated requests
users_response = requests.get(
    '${import.meta.env.VITE_SUPABASE_URL}/functions/v1/users',
    headers={'Authorization': f'Bearer {token}'}
)

users = users_response.json()`}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
