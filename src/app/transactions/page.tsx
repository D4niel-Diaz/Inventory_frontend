'use client';

import { useState, useEffect } from 'react';
import { transactionService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { Loading } from '@/components/ui/Loading';
import { BackButton } from '@/components/ui/BackButton';

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

  if (loading) {
    return <Loading text="Loading transactions..." />;
  }

  return (
    <div className="py-6">
      <BackButton href="/dashboard" className="mb-4" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Transaction History</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('borrowed')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'borrowed'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Borrowed
            </button>
            <button
              onClick={() => setFilter('returned')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                filter === 'returned'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Returned
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      {isAdmin && (
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                      )}
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction: any) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.created_at || transaction.borrow_date).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{transaction.item?.name || 'Item'}</div>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.due_date ? new Date(transaction.due_date).toLocaleDateString() : '-'}
                          </td>
                          {isAdmin && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.user?.name || 'Unknown'}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {!isAdmin && transaction.status === 'borrowed' && (
                              <button
                                onClick={() => handleReturn(transaction.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Return
                              </button>
                            )}
                            {isAdmin && transaction.status === 'borrowed' && (
                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() => handleReturn(transaction.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Return
                                </button>
                                <button
                                  onClick={() => handleCancel(transaction.id)}
                                  className="text-red-600 hover:text-red-900"
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
                        <td colSpan={isAdmin ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
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
  );
}