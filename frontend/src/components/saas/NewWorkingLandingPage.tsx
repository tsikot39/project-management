import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  ArrowUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkingLandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Fixed Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-300'
            : 'bg-transparent border-b border-gray-300'
        }`}
      >
        <div className="container mx-auto px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h2v18H3V3zm4 0h2v18H7V3zm4 0h2v18h-2V3zm4 2h8v2h-8V5zm0 4h8v2h-8V9zm0 4h8v2h-8v-2zm0 4h8v2h-8v-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Taskflow</span>
            </button>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('features')}
                className={`transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className={`transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className={`transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className={`transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                About
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={`transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Hero Section */}
      <section className="relative pt-20 pb-8 overflow-hidden min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="container mx-auto px-8 lg:px-12 relative">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 text-blue-800 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-sm hover:shadow-md transition-shadow">
              <Zap className="w-4 h-4" />
              <span>Trusted by 10,000+ teams worldwide</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Turn Project Chaos into
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Perfect Execution
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              The only project management platform that actually makes your team
              more productive.
              <span className="font-semibold text-gray-800">
                {' '}
                No complexity, no confusion—just results.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center justify-center group min-w-[180px]"
              >
                Start Free Trial
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 inline-flex items-center justify-center min-w-[180px]">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">14-day free trial</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  10,000+
                </div>
                <div className="text-gray-600 text-sm">Teams Trust Us</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  99.9%
                </div>
                <div className="text-gray-600 text-sm">Uptime Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  4.9/5
                </div>
                <div className="text-gray-600 text-sm flex items-center justify-center">
                  Customer Rating
                  <div className="flex ml-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="min-h-screen flex items-start py-20 bg-white scroll-mt-10"
      >
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to keep your team aligned, productive,
              and focused on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
                title: 'Real-time Analytics',
                description:
                  'Track project progress, team performance, and resource allocation with live dashboards and insights.',
              },
              {
                icon: <Users className="w-8 h-8 text-purple-600" />,
                title: 'Team Collaboration',
                description:
                  'Seamless communication with built-in chat, file sharing, and collaborative workspaces.',
              },
              {
                icon: <Shield className="w-8 h-8 text-green-600" />,
                title: 'Enterprise Security',
                description:
                  'Bank-level security with end-to-end encryption, SSO, and comprehensive audit trails.',
              },
              {
                icon: <Clock className="w-8 h-8 text-orange-600" />,
                title: 'Time Tracking',
                description:
                  'Accurate time logging with automated timesheets and detailed productivity reports.',
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-600" />,
                title: 'Automation',
                description:
                  'Streamline workflows with smart automation, custom triggers, and seamless integrations.',
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
                title: 'Task Management',
                description:
                  'Intuitive task organization with dependencies, priorities, and custom workflow stages.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className="min-h-screen flex items-center py-20 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Taskflow Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get up and running in minutes with our intuitive three-step
              process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Create Your Workspace',
                description:
                  'Set up your organization and invite team members. Customize your workspace to match your workflow preferences.',
              },
              {
                step: '02',
                title: 'Build Your Projects',
                description:
                  'Create projects, define tasks, and set up workflows. Use our templates or build from scratch to fit your needs.',
              },
              {
                step: '03',
                title: 'Collaborate & Deliver',
                description:
                  'Work together in real-time, track progress, and deliver projects on time with our powerful collaboration tools.',
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="min-h-screen flex items-center py-20 bg-white scroll-mt-10"
      >
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your team size and needs. All plans
              include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$9',
                period: 'per user/month',
                description: 'Perfect for small teams getting started',
                features: [
                  'Up to 5 users',
                  'Unlimited projects',
                  'Basic reporting',
                  'Email support',
                  'Mobile apps',
                ],
                popular: false,
              },
              {
                name: 'Professional',
                price: '$19',
                period: 'per user/month',
                description: 'Best for growing teams and businesses',
                features: [
                  'Up to 50 users',
                  'Advanced analytics',
                  'Time tracking',
                  'Priority support',
                  'Custom workflows',
                  'API access',
                ],
                popular: true,
              },
              {
                name: 'Enterprise',
                price: '$39',
                period: 'per user/month',
                description: 'For large organizations with advanced needs',
                features: [
                  'Unlimited users',
                  'Advanced security',
                  'Custom integrations',
                  'Dedicated support',
                  'SSO & SAML',
                  'Advanced permissions',
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 ${
                  plan.popular
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="min-h-screen flex items-center py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about Taskflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Taskflow transformed how our team works. We're more organized, productive, and actually enjoy project management now.",
                author: 'Sarah Johnson',
                role: 'Product Manager at TechCorp',
                rating: 5,
              },
              {
                quote:
                  "The best project management tool we've used. Intuitive interface and powerful features that actually help us get work done.",
                author: 'Mike Chen',
                role: 'Engineering Lead at StartupXYZ',
                rating: 5,
              },
              {
                quote:
                  "Finally, a project management tool that doesn't get in the way. Our team adopted it immediately and our productivity soared.",
                author: 'Emily Davis',
                role: 'Operations Director at GrowthCo',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center py-20 bg-white"
      >
        <div className="container mx-auto px-8 lg:px-12 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Built for teams who want to focus on what matters
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe project management should be simple, intuitive, and
                actually helpful. That's why we built Taskflow from the ground
                up to eliminate complexity while providing the powerful features
                teams need to succeed.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our mission is to help teams around the world work more
                effectively together, delivering better results while reducing
                stress and confusion. Join thousands of teams who have already
                transformed their workflows with Taskflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors inline-flex items-center justify-center"
                >
                  Start Your Free Trial
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
              <div className="space-y-8">
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    50,000+
                  </div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    99.9%
                  </div>
                  <div className="text-gray-600">Uptime</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    24/7
                  </div>
                  <div className="text-gray-600">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-8 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-3 mb-6 group cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h2v18H3V3zm4 0h2v18H7V3zm4 0h2v18h-2V3zm4 2h8v2h-8V5zm0 4h8v2h-8V9zm0 4h8v2h-8v-2zm0 4h8v2h-8v-2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                  Taskflow
                </span>
              </button>
              <p className="text-gray-400 leading-relaxed">
                The project management platform that helps teams work smarter,
                not harder.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 Taskflow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkingLandingPage;
