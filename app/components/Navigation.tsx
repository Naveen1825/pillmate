'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="bg-transparent sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <span className="font-fraunces text-2xl font-semibold text-sage">PillMate</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-stone-700 hover:text-sage transition-colors duration-300 font-jakarta font-medium">
              Home
            </Link>
            <Link href="/upload" className="text-stone-700 hover:text-sage transition-colors duration-300 font-jakarta font-medium">
              Upload Prescription
            </Link>
            <Link href="/medications" className="text-stone-700 hover:text-sage transition-colors duration-300 font-jakarta font-medium">
              My Medications
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border-2 border-sage/20"
                  referrerPolicy="no-referrer"
                />
                <span className="text-stone-600 font-jakarta text-sm">{user.displayName?.split(' ')[0]}</span>
                <button
                  data-testid="logout-button"
                  onClick={handleLogout}
                  className="text-stone-400 hover:text-stone-600 transition-colors duration-300 font-jakarta text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full px-6 py-2.5 font-jakarta font-semibold text-white bg-sage shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            data-testid="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-sage"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-3" data-testid="mobile-menu">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-stone-700 hover:text-sage transition-colors duration-300 font-jakarta font-medium">
              Home
            </Link>
            <Link href="/upload" onClick={() => setMobileMenuOpen(false)} className="block text-stone-700 hover:text-sage transition-colors duration-300 font-jakarta font-medium">
              Upload Prescription
            </Link>
            <Link href="/medications" onClick={() => setMobileMenuOpen(false)} className="block text-stone-700 hover:text-sage transition-colors duration-300 font-jakarta font-medium">
              My Medications
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pt-2 border-t border-stone-100">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border-2 border-sage/20"
                  referrerPolicy="no-referrer"
                />
                <span className="text-stone-600 font-jakarta text-sm">{user.displayName?.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="ml-auto text-stone-400 hover:text-stone-600 transition-colors duration-300 font-jakarta text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center rounded-full px-6 py-2.5 font-jakarta font-semibold text-white bg-sage shadow-md text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export { Navigation };
