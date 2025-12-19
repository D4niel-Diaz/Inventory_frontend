'use client';

import { useState, useEffect } from 'react';
import { transactionService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { Loading } from '@/components/ui/Loading';
import Navigation from '@/components/Navigation';

export default function Transactions() {
  const { isAdmin } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = isAdmin 
          ? await transactionService.getAllAdmin()
          : await transactionService.getUserTransactions();
        // Backend returns { status: true, data: [...] }
        const transactionsData = response.data.data || response.data || [];
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isAdmin]);

  const handleReturn = async (id: number) => {
    if (window.confirm('Are you sure you want to return this item?')) {
      try {
        const response = await transactionService.returnItem(id);
        toast.success(response.data.message || 'Item returned successfully');
        // Refresh transactions
        const response2 = isAdmin 
          ? await transactionService.getAllAdmin()
          : await transactionService.getUserTransactions();
        const transactionsData = response2.data.data || response2.data || [];
        setTransactions(transactionsData);
      } catch (error: any) {
        console.error('Error returning item:', error);
        toast.error(error.response?.data?.message || 'Failed to return item');
      }
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this transaction?')) {
      try {
        const response = await transactionService.cancel(id);
        toast.success(response.data.message || 'Transaction cancelled successfully');
        // Refresh transactions
        const response2 = await transactionService.getAllAdmin();
        const transactionsData = response2.data.data || response2.data || [];
        setTransactions(transactionsData);
      } catch (error: any) {
        console.error('Error cancelling transaction:', error);
        toast.error(error.response?.data?.message || 'Failed to cancel transaction');
      }
    }
  };

  const filteredTransactions = transactions.filter((transaction: any) => {
    if (filter === 'all') return true;
    return transaction.status === filter;
  });

  const totalCount = transactions.length;
  const borrowedCount = transactions.filter((t: any) => t.status === 'borrowed').length;
  const returnedCount = transactions.filter((t: any) => t.status === 'returned').length;

  if (loading) {
    return (
      <>
        <Navigation />
        <Loading text="Loading transactions..." />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0a2540] bg-opacity-90 backdrop-blur-sm rounded-2xl border-2 border-cyan-400 shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-serif text-white">Transactions Dashboard</h1>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-semibold rounded-md border transition-colors ${
                    filter === 'all'
                      ? 'bg-cyan-400 text-[#0d476b] border-cyan-400'
                      : 'bg-white/10 text-white border-cyan-700 hover:bg-white/15'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('borrowed')}
                  className={`px-4 py-2 text-sm font-semibold rounded-md border transition-colors ${
                    filter === 'borrowed'
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white/10 text-white border-cyan-700 hover:bg-white/15'
                  }`}
                >
                  Borrowed
                </button>
                <button
                  onClick={() => setFilter('returned')}
                  className={`px-4 py-2 text-sm font-semibold rounded-md border transition-colors ${
                    filter === 'returned'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white/10 text-white border-cyan-700 hover:bg-white/15'
                  }`}
                >
                  Returned
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-[#061b2f] rounded-xl border border-cyan-700 p-5">
                <div className="text-sm text-gray-300">Total Transactions</div>
                <div className="mt-1 text-3xl font-semibold text-white">{totalCount}</div>
              </div>
              <div className="bg-[#061b2f] rounded-xl border border-cyan-700 p-5">
                <div className="text-sm text-gray-300">Borrowed</div>
                <div className="mt-1 text-3xl font-semibold text-orange-300">{borrowedCount}</div>
              </div>
              <div className="bg-[#061b2f] rounded-xl border border-cyan-700 p-5">
                <div className="text-sm text-gray-300">Returned</div>
                <div className="mt-1 text-3xl font-semibold text-green-300">{returnedCount}</div>
              </div>
            </div>

            <div className="mt-8">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow-2xl overflow-hidden border border-cyan-700 rounded-xl">
                    <table className="min-w-full divide-y divide-cyan-900">
                      <thead className="bg-cyan-500/20">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                            Item
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                            Due Date
                          </th>
                          {isAdmin && (
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                              User
                            </th>
                          )}
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[#061b2f]/60 divide-y divide-cyan-900">
                        {filteredTransactions.length > 0 ? (
                          filteredTransactions.map((transaction: any) => (
                            <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {new Date(transaction.created_at || transaction.borrow_date).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-white">{transaction.item?.name || 'Item'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  transaction.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' : 
                                  transaction.status === 'returned' ? 'bg-green-100 text-green-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {transaction.status || 'unknown'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {transaction.due_date ? new Date(transaction.due_date).toLocaleDateString() : '-'}
                              </td>
                              {isAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                  {transaction.user?.name || 'Unknown'}
                                </td>
                              )}
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {!isAdmin && transaction.status === 'borrowed' && (
                                  <button
                                    onClick={() => handleReturn(transaction.id)}
                                    className="inline-flex items-center px-4 py-1.5 rounded-md bg-cyan-400 text-[#0d476b] hover:bg-cyan-500 shadow-sm"
                                  >
                                    Return
                                  </button>
                                )}
                                {isAdmin && transaction.status === 'borrowed' && (
                                  <div className="flex space-x-2 justify-end">
                                    <button
                                      onClick={() => handleReturn(transaction.id)}
                                      className="inline-flex items-center px-4 py-1.5 rounded-md bg-green-500 text-white hover:bg-green-600 shadow-sm"
                                    >
                                      Return
                                    </button>
                                    <button
                                      onClick={() => handleCancel(transaction.id)}
                                      className="inline-flex items-center px-4 py-1.5 rounded-md bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center text-sm text-gray-300">
                              No transactions found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}