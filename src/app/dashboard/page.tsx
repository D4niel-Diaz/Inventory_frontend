'use client';

import { useEffect, useState } from 'react';
import { transactionService } from '@/lib/api';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

export default function Dashboard() {
  const { user } = useAuth();
  const [borrowedItems, setBorrowedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedItems = async () => {
      try {
        setLoading(true);
        
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await transactionService.getUserTransactions();
        const transactions = response.data.data || response.data || [];
        
        // Filter only borrowed items (not returned)
        const borrowed = transactions.filter((t: any) => t.status === 'borrowed');
        setBorrowedItems(borrowed);
      } catch (error: any) {
        console.error('Error fetching borrowed items:', error);
        if (error?.response?.status !== 401) {
          console.error('Dashboard data fetch failed:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowedItems();
  }, []);

  if (loading) {
    return (
      <>
        <Navigation />
        <Loading text="Loading dashboard..." />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0a2540] bg-opacity-90 backdrop-blur-sm rounded-2xl border-2 border-cyan-400 shadow-2xl p-8">
            <h1 className="text-4xl font-serif text-center mb-8">
              <span className="text-white">Welcome, </span>
              <span className="text-cyan-300">{user?.name || 'User'}!</span>
            </h1>
            
            {/* Account Information */}
            <div className="mb-8">
              <h2 className="text-xl font-serif text-white mb-4 border-b border-gray-600 pb-2">
                Account Information
              </h2>
              <div className="space-y-2 text-gray-300">
                <p><span className="font-medium">Username:</span> {user?.name || 'N/A'}</p>
                <p><span className="font-medium">Email:</span> {user?.email || 'N/A'}</p>
                <p><span className="font-medium">Role:</span> {user?.roles_array?.[0] || 'user'}</p>
              </div>
            </div>

            {/* Borrowed Items */}
            <div>
              <h2 className="text-xl font-serif text-white mb-4 border-b border-gray-600 pb-2">
                Borrowed Items
              </h2>
              
              {borrowedItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-600">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Borrowed On</th>
                        <th className="pb-3 font-medium">Due Date</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {borrowedItems.map((item: any) => (
                        <tr key={item.id} className="border-b border-gray-700">
                          <td className="py-3">{item.item?.name || 'N/A'}</td>
                          <td className="py-3">{item.borrow_date ? new Date(item.borrow_date).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-3">{item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}</td>
                          <td className="py-3">
                            <span className={`px-3 py-1 rounded text-sm ${
                              item.status === 'borrowed' ? 'bg-orange-500 text-white' :
                              item.status === 'returned' ? 'bg-green-500 text-white' :
                              'bg-gray-500 text-white'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No borrowed items</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}