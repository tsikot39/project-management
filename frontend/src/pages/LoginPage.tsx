import React from 'react';

import { Button, Input, Card } from '@/components/ui/quickui';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-large mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">
            Welcome back
          </h1>
          <p className="text-on-surface-variant">
            Sign in to your ProjectHub account
          </p>
        </div>

        <Card className="animate-slide-up">
          <form className="space-y-6">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              className="text-base"
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              className="text-base"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary-500 focus:ring-primary-500/20"
                />
                <span className="ml-2 text-sm text-on-surface-variant">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Forgot password?
              </a>
            </div>

            <Button className="w-full text-base" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Create account
              </a>
            </p>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-on-surface-variant">
            <a href="#" className="hover:text-on-surface">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-on-surface">
              Terms
            </a>
            <span>•</span>
            <a href="#" className="hover:text-on-surface">
              Help
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
