'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { itemService, transactionService } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { BackButton } from '@/components/ui/BackButton';

export default function ItemDetail({ params }: { params: { id: string } }) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowDate, setBorrowDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setLoading(true);
        const itemResponse = await itemService.getById(parseInt(params.id));
        // Backend returns { status: true, data: {...} }
        const itemData = itemResponse.data.data || itemResponse.data;
        setItem(itemData);
        
        // Fetch transactions for this item - filter from all transactions
        const transactionsResponse = await transactionService.getUserTransactions();
        const allTransactions = transactionsResponse.data.data || transactionsResponse.data || [];
        const itemTransactions = allTransactions.filter((t: any) => t.item_id === parseInt(params.id));
        setTransactions(itemTransactions);
      } catch (error: any) {
        console.error('Error fetching item data:', error);
        toast.error(error.response?.data?.message || 'Failed to load item data');
        router.push('/inventory');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
    fetchItemData();
    }
  }, [params.id, router]);

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!item || item.quantity < 1) {
        toast.error('Item is not available for borrowing');
        return;
      }
      
      if (item.status !== 'available') {
        toast.error('Item is not available for borrowing');
        return;
      }
      
      const transactionData = {
        item_id: item.id,
        borrow_date: borrowDate || new Date().toISOString().split('T')[0],
        due_date: dueDate || (() => {
          const d = new Date();
          d.setDate(d.getDate() + 7);
          return d.toISOString().split('T')[0];
        })(),
      };
      
      const response = await transactionService.borrow(transactionData);
      toast.success(response.data.message || 'Item borrowed successfully');
      
      // Refresh item data
      const itemResponse = await itemService.getById(parseInt(params.id));
      const itemData = itemResponse.data.data || itemResponse.data;
      setItem(itemData);
      
      // Refresh transactions
      const transactionsResponse = await transactionService.getUserTransactions();
      const allTransactions = transactionsResponse.data.data || transactionsResponse.data || [];
      const itemTransactions = allTransactions.filter((t: any) => t.item_id === parseInt(params.id));
      setTransactions(itemTransactions);
      
      setShowBorrowModal(false);
    } catch (error: any) {
      console.error('Error borrowing item:', error);
      toast.error(error.response?.data?.message || 'Failed to borrow item');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading item data...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-900">Item not found</h2>
        <p className="mt-2 text-gray-600">The item you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
        <BackButton href="/inventory" className="mt-4 inline-flex" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton href="/inventory" className="mb-4" />
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">{item.name}</h1>
          <div className="flex space-x-3">
            {!isAdmin && item.status === 'available' && item.quantity > 0 && (
            <button
              onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  setBorrowDate(today);
                  setDueDate(nextWeek.toISOString().split('T')[0]);
                  setShowBorrowModal(true);
              }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
                Borrow Item
            </button>
            )}
            {isAdmin && (
              <button
                onClick={() => router.push(`/inventory/edit/${item.id}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Edit Item
              </button>
            )}
          </div>
        </div>

        {/* Item Image */}
        {item.image && (
          <div className="mt-6">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${item.image}`}
              alt={item.name}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Item Details */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Item Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and information about the item.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.name}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.description || 'No description provided'}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{item.category?.name || 'Uncategorized'}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Current Stock</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.quantity} units
                  </span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'available' ? 'bg-green-100 text-green-800' : 
                    item.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status || 'available'}
                  </span>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(item.updated_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
          <div className="mt-4 flex flex-col">
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
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.length > 0 ? (
                        transactions.map((transaction: any) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.created_at || transaction.borrow_date).toLocaleString()}
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
                              {transaction.user?.name || 'Unknown'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.due_date ? new Date(transaction.due_date).toLocaleDateString() : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                            No transaction history found
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

      {/* Borrow Modal */}
      {showBorrowModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleBorrow}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Borrow Item: {item.name}
                      </h3>
                      <div className="mt-2">
                        <div className="mb-4">
                          <label htmlFor="borrow_date" className="block text-sm font-medium text-gray-700">Borrow Date</label>
                          <input
                            type="date"
                            name="borrow_date"
                            id="borrow_date"
                            required
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={borrowDate}
                            onChange={(e) => setBorrowDate(e.target.value)}
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">Due Date</label>
                          <input
                            type="date"
                            name="due_date"
                            id="due_date"
                            required
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Available: {item.quantity} units
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Borrow Item
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowBorrowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
