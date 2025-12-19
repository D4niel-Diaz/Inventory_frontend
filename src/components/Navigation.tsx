'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-[#0d476b] border-b border-cyan-600 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center">
              <svg className="h-10 w-10 text-cyan-400" fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M260.44 2.138L15.938 256.634l31.114 31.114L85.112 291.95v169.912h341.776V291.95l38.06-4.188 31.114-31.114L260.44 2.138zM315.522 461.862h-111.08V350.782h111.08v111.08z"/>
              </svg>
            </Link>
            
            <div className="flex space-x-6">
              <Link
                href="/profile"
                className="text-white hover:text-cyan-300 text-base font-medium transition-colors"
              >
                Profile
              </Link>
              
              <Link
                href="/inventory"
                className="text-white hover:text-cyan-300 text-base font-medium transition-colors"
              >
                {isAdmin ? 'View Inventory' : 'Borrow Item'}
              </Link>

              <Link
                href="/transactions"
                className="text-white hover:text-cyan-300 text-base font-medium transition-colors"
              >
                Transactions
              </Link>

              {isAdmin && (
                <Link
                  href="/categories"
                  className="text-white hover:text-cyan-300 text-base font-medium transition-colors"
                >
                  Add Item
                </Link>
              )}
              
              <Link
                href="/about"
                className="text-white hover:text-cyan-300 text-base font-medium transition-colors"
              >
                About Us
              </Link>
              
              <Link
                href="/contact"
                className="text-white hover:text-cyan-300 text-base font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={logout}
              className="px-6 py-2 rounded-md text-[#0d476b] font-semibold bg-cyan-400 hover:bg-cyan-500 transition-colors shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
