import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function WorkingLandingPage() {
  const navigate = useNavigate();
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    organizationName: '',
    organizationSlug: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
          organization_name: formData.organizationName,
          organization_slug: formData.organizationSlug,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('access_token', data.data.access_token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem(
          'organization',
          JSON.stringify(data.data.organization)
        );
        navigate(`/${data.data.organization.slug}/dashboard`);
      } else {
        alert('Signup failed: ' + (data.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleOrganizationNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      organizationName: name,
      organizationSlug: generateSlug(name),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ProjectHub
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() =>
                  document
                    .getElementById('features')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById('how-it-works')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById('pricing')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById('testimonials')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Testimonials
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById('about')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                About
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              {/* Desktop buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-6 space-y-4">
                <button
                  onClick={() => {
                    document
                      .getElementById('features')
                      ?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    document
                      .getElementById('how-it-works')
                      ?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  How It Works
                </button>
                <button
                  onClick={() => {
                    document
                      .getElementById('pricing')
                      ?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => {
                    document
                      .getElementById('testimonials')
                      ?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => {
                    document
                      .getElementById('about')
                      ?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  About
                </button>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <button
                    className="block w-full px-4 py-2 text-left text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignupOpen(true)}
                    className="block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-center"
                  >
                    Get Started Free
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 mb-4">
                <span>⭐</span>
                <span className="ml-1">Trusted by 10,000+ teams worldwide</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Projects That
                <br />
                Actually Get Done
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline your workflow, collaborate seamlessly, and deliver
                projects on time. The all-in-one platform for modern teams.
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center"
                >
                  Start Free Trial →
                </button>
                <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Watch Demo
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Free 14-day trial • No credit card required • Cancel anytime
              </p>
            </div>

            {/* Right Column - Polished App Preview SVG */}
            <div className="flex justify-center">
              <svg
                width="520"
                height="380"
                viewBox="0 0 520 380"
                className="w-full max-w-xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="headerGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient
                    id="cardGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F8FAFC" />
                  </linearGradient>
                  <filter
                    id="appShadow"
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="12"
                      stdDeviation="20"
                      floodColor="rgba(0,0,0,0.15)"
                    />
                  </filter>
                  <filter
                    id="cardShadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="8"
                      floodColor="rgba(0,0,0,0.08)"
                    />
                  </filter>
                </defs>

                {/* Main App Window */}
                <rect
                  x="40"
                  y="30"
                  width="440"
                  height="320"
                  rx="16"
                  fill="#FFFFFF"
                  filter="url(#appShadow)"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />

                {/* App Header with Brand */}
                <rect
                  x="40"
                  y="30"
                  width="440"
                  height="70"
                  rx="16"
                  fill="url(#headerGradient)"
                />
                <rect
                  x="40"
                  y="86"
                  width="440"
                  height="1"
                  fill="rgba(255,255,255,0.2)"
                />

                {/* Logo & Brand */}
                <circle cx="75" cy="65" r="18" fill="#FFFFFF" />
                <text
                  x="75"
                  y="72"
                  textAnchor="middle"
                  fill="url(#headerGradient)"
                  fontSize="20"
                  fontWeight="bold"
                  fontFamily="system-ui"
                >
                  P
                </text>
                <text
                  x="105"
                  y="62"
                  fill="#FFFFFF"
                  fontSize="22"
                  fontWeight="bold"
                  fontFamily="system-ui"
                >
                  ProjectHub
                </text>
                <text
                  x="105"
                  y="78"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="12"
                  fontFamily="system-ui"
                >
                  Dashboard
                </text>

                {/* Navigation Pills */}
                <rect
                  x="280"
                  y="52"
                  width="60"
                  height="26"
                  rx="13"
                  fill="rgba(255,255,255,0.25)"
                />
                <text
                  x="310"
                  y="67"
                  fill="#FFFFFF"
                  fontSize="11"
                  textAnchor="middle"
                  fontWeight="600"
                  fontFamily="system-ui"
                >
                  Projects
                </text>
                <rect
                  x="350"
                  y="52"
                  width="50"
                  height="26"
                  rx="13"
                  fill="rgba(255,255,255,0.1)"
                />
                <text
                  x="375"
                  y="67"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="system-ui"
                >
                  Teams
                </text>
                <rect
                  x="410"
                  y="52"
                  width="50"
                  height="26"
                  rx="13"
                  fill="rgba(255,255,255,0.1)"
                />
                <text
                  x="435"
                  y="67"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="system-ui"
                >
                  Tasks
                </text>

                {/* Main Content Area */}
                <rect
                  x="70"
                  y="110"
                  width="360"
                  height="180"
                  fill="#FAFBFC"
                  rx="8"
                />

                {/* Dashboard Cards - Simplified */}
                <rect
                  x="90"
                  y="130"
                  width="80"
                  height="60"
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x="130"
                  y="150"
                  fill="#3B82F6"
                  fontSize="24"
                  textAnchor="middle"
                >
                  �
                </text>
                <text
                  x="130"
                  y="175"
                  fill="#111827"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="600"
                  fontFamily="system-ui"
                >
                  Projects
                </text>

                <rect
                  x="180"
                  y="130"
                  width="80"
                  height="60"
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x="220"
                  y="150"
                  fill="#10B981"
                  fontSize="24"
                  textAnchor="middle"
                >
                  ✅
                </text>
                <text
                  x="220"
                  y="175"
                  fill="#111827"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="600"
                  fontFamily="system-ui"
                >
                  Tasks
                </text>

                <rect
                  x="270"
                  y="130"
                  width="80"
                  height="60"
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x="310"
                  y="150"
                  fill="#8B5CF6"
                  fontSize="24"
                  textAnchor="middle"
                >
                  👥
                </text>
                <text
                  x="310"
                  y="175"
                  fill="#111827"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="600"
                  fontFamily="system-ui"
                >
                  Team
                </text>

                {/* Project List Preview */}
                <rect
                  x="90"
                  y="210"
                  width="260"
                  height="60"
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <text
                  x="105"
                  y="230"
                  fill="#111827"
                  fontSize="14"
                  fontWeight="600"
                  fontFamily="system-ui"
                >
                  Recent Projects
                </text>

                {/* Project Items - Clean Lines */}
                <circle cx="110" cy="245" r="4" fill="#3B82F6" />
                <rect
                  x="120"
                  y="241"
                  width="100"
                  height="8"
                  rx="4"
                  fill="#F1F5F9"
                />
                <rect
                  x="120"
                  y="241"
                  width="70"
                  height="8"
                  rx="4"
                  fill="#3B82F6"
                />

                <circle cx="110" cy="260" r="4" fill="#10B981" />
                <rect
                  x="120"
                  y="256"
                  width="100"
                  height="8"
                  rx="4"
                  fill="#F1F5F9"
                />
                <rect
                  x="120"
                  y="256"
                  width="85"
                  height="8"
                  rx="4"
                  fill="#10B981"
                />

                {/* Action Button */}
                <rect
                  x="270"
                  y="235"
                  width="70"
                  height="28"
                  rx="14"
                  fill="url(#headerGradient)"
                />
                <text
                  x="305"
                  y="252"
                  fill="#FFFFFF"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="600"
                  fontFamily="system-ui"
                >
                  + New
                </text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to manage projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From planning to delivery, we've got you covered with powerful
            features designed for modern teams.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Work together seamlessly with real-time updates, comments, and
              notifications.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">
              Track progress, measure performance, and make data-driven
              decisions.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
            <p className="text-gray-600">
              Keep your data secure with advanced encryption and compliance
              features.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 bg-white"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How ProjectHub Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your team organized and productive in just three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-bold text-xl">
              1
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Create Your Organization
            </h3>
            <p className="text-gray-600 mb-4">
              Sign up and set up your organization in seconds. Invite your team
              members and start collaborating immediately.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-2">
                ✓ Custom organization URL
              </div>
              <div className="text-sm text-gray-500 mb-2">
                ✓ Team member invitations
              </div>
              <div className="text-sm text-gray-500">
                ✓ Role-based permissions
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-bold text-xl">
              2
            </div>
            <h3 className="text-xl font-semibold mb-4">Plan Your Projects</h3>
            <p className="text-gray-600 mb-4">
              Create projects, break them down into tasks, set deadlines, and
              assign team members with our intuitive interface.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-2">
                ✓ Project templates
              </div>
              <div className="text-sm text-gray-500 mb-2">
                ✓ Task dependencies
              </div>
              <div className="text-sm text-gray-500">✓ Timeline management</div>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-semibold mb-4">Track & Deliver</h3>
            <p className="text-gray-600 mb-4">
              Monitor progress with real-time dashboards, automated reports, and
              analytics to keep everything on track.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-2">
                ✓ Real-time updates
              </div>
              <div className="text-sm text-gray-500 mb-2">
                ✓ Progress analytics
              </div>
              <div className="text-sm text-gray-500">✓ Automated reporting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 bg-gray-50"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your team. Start free, upgrade when you
            need more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-2">$0</div>
              <p className="text-gray-600">
                Perfect for small teams getting started
              </p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Up to 5 team members</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>3 projects</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Basic task management</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Email support</span>
              </li>
            </ul>
            <button className="w-full py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="text-4xl font-bold mb-2">$12</div>
              <p className="text-gray-600">per user/month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Up to 50 team members</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Custom integrations</span>
              </li>
            </ul>
            <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
              Start Free Trial
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-2">$25</div>
              <p className="text-gray-600">per user/month</p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Unlimited team members</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Advanced security</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Custom workflows</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>24/7 phone support</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✓</span>
                <span>Dedicated account manager</span>
              </li>
            </ul>
            <button className="w-full py-3 px-6 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 bg-white"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Teams Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers have to say about ProjectHub.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex mb-4">
              <span className="text-yellow-400 text-xl">★★★★★</span>
            </div>
            <p className="text-gray-700 mb-6">
              "ProjectHub transformed how our remote team collaborates. The
              real-time updates and intuitive interface make project management
              effortless."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                S
              </div>
              <div>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-gray-600 text-sm">
                  Product Manager, TechCorp
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex mb-4">
              <span className="text-yellow-400 text-xl">★★★★★</span>
            </div>
            <p className="text-gray-700 mb-6">
              "We've tried many project management tools, but ProjectHub's
              simplicity and powerful features make it our go-to choice for all
              projects."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                M
              </div>
              <div>
                <div className="font-semibold">Michael Chen</div>
                <div className="text-gray-600 text-sm">CTO, StartupXYZ</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="flex mb-4">
              <span className="text-yellow-400 text-xl">★★★★★</span>
            </div>
            <p className="text-gray-700 mb-6">
              "The analytics and reporting features give us insights we never
              had before. Our project delivery has improved by 40% since
              switching."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                E
              </div>
              <div>
                <div className="font-semibold">Emily Rodriguez</div>
                <div className="text-gray-600 text-sm">
                  Operations Director, AgencyPro
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 bg-gray-50"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built for Modern Teams
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              ProjectHub was created by a team of experienced project managers
              and developers who understand the challenges of coordinating
              complex projects across distributed teams.
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
                  <p className="text-gray-600">
                    To simplify project management and help teams deliver
                    exceptional results without the complexity of traditional
                    tools.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Our Vision</h3>
                  <p className="text-gray-600">
                    A world where every team has access to powerful, intuitive
                    project management tools that scale with their growth.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-2xl">🌟</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Our Values</h3>
                  <p className="text-gray-600">
                    Simplicity, reliability, and customer success drive
                    everything we do. Your success is our success.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Why Choose ProjectHub?
            </h3>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold">Trusted by 10,000+ Teams</h4>
                  <p className="text-gray-600 text-sm">
                    From startups to Fortune 500 companies
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold">99.9% Uptime Guarantee</h4>
                  <p className="text-gray-600 text-sm">
                    Enterprise-grade reliability
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold">24/7 Customer Support</h4>
                  <p className="text-gray-600 text-sm">
                    Real humans ready to help
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold">SOC 2 Type II Compliant</h4>
                  <p className="text-gray-600 text-sm">
                    Your data is always secure
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold">14-Day Free Trial</h4>
                  <p className="text-gray-600 text-sm">
                    No credit card required
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsSignupOpen(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold"
              >
                Start Your Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Team's Productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who have streamlined their workflow with
            ProjectHub. Start your free trial today and experience the
            difference.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsSignupOpen(true)}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Start Your Free Trial
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg">
              Schedule Demo
            </button>
          </div>
          <p className="text-blue-200 mt-4">
            No setup fees • Cancel anytime • 24/7 support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-2xl font-bold">ProjectHub</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The complete project management platform for modern teams.
                Streamline workflows, boost collaboration, and deliver
                exceptional results.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-blue-400">📧</span>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-blue-400">🐦</span>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <span className="text-blue-400">💼</span>
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button className="hover:text-white transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Pricing
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Templates
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Integrations
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    API
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button className="hover:text-white transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Careers
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Press
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Partners
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button className="hover:text-white transition-colors">
                    Help Center
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Documentation
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Tutorials
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Community
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Status
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 ProjectHub. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <button className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </button>
                <button className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </button>
                <button className="text-gray-400 hover:text-white text-sm transition-colors">
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center z-50 hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Signup Modal */}
      {isSignupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-xl mr-2">🏢</span>
              <h2 className="text-xl font-semibold">Create Your Account</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Start your free trial today. No credit card required.
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="organizationName"
                  className="block text-sm font-medium mb-1"
                >
                  Organization Name
                </label>
                <input
                  id="organizationName"
                  type="text"
                  placeholder="Acme Corp"
                  value={formData.organizationName}
                  onChange={(e) => handleOrganizationNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="organizationSlug"
                  className="block text-sm font-medium mb-1"
                >
                  Organization URL
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-sm text-gray-500">
                    projecthub.com/
                  </span>
                  <input
                    id="organizationSlug"
                    type="text"
                    placeholder="acme-corp"
                    value={formData.organizationSlug}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        organizationSlug: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsSignupOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
