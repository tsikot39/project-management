import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function SimplePage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          🚀 SaaS Project Management
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your app is running successfully!
        </p>
        <div className="space-y-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            Backend: http://localhost:8000
          </button>
          <br />
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg">
            Frontend: http://localhost:3000
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimplePage />} />
        <Route path="*" element={<SimplePage />} />
      </Routes>
    </Router>
  );
}

export default App;
