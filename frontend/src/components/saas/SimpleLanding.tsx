import { useNavigate } from 'react-router-dom';

export function SimpleLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">ProjectHub</h1>
        <p className="text-xl text-gray-600 mb-8">
          SaaS Project Management Platform
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => alert('Signup coming soon!')}
            className="w-full px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Free
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <p>Backend: http://localhost:8000</p>
          <p>Frontend: http://localhost:3000</p>
        </div>
      </div>
    </div>
  );
}
