'use client';

import { useEffect, useState } from 'react';
import { itemService, transactionService, categoryService, userService } from '@/lib/api';
import Link from 'next/link';
import { Loading } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCategories: 0,
    totalUsers: 0,
    recentTransactions: [],
    lowStockItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const promises = [
          itemService.getUserItems(),
          categoryService.getUserCategories(),
          transactionService.getUserTransactions(),
        ];

        // Only admins can see user list
        if (isAdmin) {
          promises.push(userService.getAllUsers());
        }

        const [itemsRes, categoriesRes, transactionsRes, usersRes] = await Promise.all(promises as any);

        // Backend returns { status: true, data: [...] }
        const items = itemsRes.data.data || itemsRes.data || [];
        const categories = categoriesRes.data.data || categoriesRes.data || [];
        const transactions = transactionsRes.data.data || transactionsRes.data || [];
        const users = isAdmin ? (usersRes?.data?.data || usersRes?.data || []) : [];

        // Get low stock items (items with quantity less than 10)
        const lowStock = items.filter((item: any) => item.quantity < 10);

        setStats({
          totalItems: items.length,
          totalCategories: categories.length,
          totalUsers: users.length,
          recentTransactions: transactions.slice(0, 5),
          lowStockItems: lowStock
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loading text="Loading dashboard data..." />;
  }

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your inventory system</p>
      </div>
      
      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-500 rounded-lg p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{stats.totalItems}</div>
              </dd>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/inventory" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all items →
            </Link>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</div>
              </dd>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/categories" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all categories →
            </Link>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-lg p-3">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{stats.lowStockItems.length}</div>
              </dd>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link href="/inventory?filter=low-stock" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View low stock items →
            </Link>
          </div>
        </Card>
      </div>

      {isAdmin && (
        <Card className="mt-6">
          <div className="flex items-center justify-between">
            <div>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
              <dd className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</dd>
            </div>
            <Link href="/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Manage users →
            </Link>
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          {stats.recentTransactions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {stats.recentTransactions.map((transaction: any) => (
                <li key={transaction.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {transaction.status === 'borrowed' ? 'Borrowed' : transaction.status === 'returned' ? 'Returned' : transaction.status}: {transaction.item?.name || 'Item'}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <Badge 
                          variant={
                            transaction.status === 'borrowed' ? 'warning' : 
                            transaction.status === 'returned' ? 'success' : 
                            'danger'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Due: {transaction.due_date ? new Date(transaction.due_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(transaction.created_at || transaction.borrow_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No recent transactions found
            </div>
          )}
        </div>
        <div className="mt-4 text-right">
          <Link href="/transactions" className="font-medium text-indigo-600 hover:text-indigo-500">
            View all transactions
          </Link>
        </div>
      </div>

      {/* Low Stock Items */}
      {stats.lowStockItems.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900">Low Stock Items</h2>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {stats.lowStockItems.map((item: any) => (
                <li key={item.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {item.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          {item.quantity} remaining
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Category: {item.category?.name || 'Uncategorized'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Link href={`/inventory/${item.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}