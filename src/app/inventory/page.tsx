'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { itemService, categoryService } from '@/lib/api';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Loading } from '@/components/ui/Loading';
import Navigation from '@/components/Navigation';

export default function Inventory() {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 0,
    category_id: '',
    status: 'available'
  });
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsResponse, categoriesResponse] = await Promise.all([
          itemService.getUserItems(),
          categoryService.getUserCategories()
        ]);
        // Backend returns { status: true, data: [...] }
        const itemsData = itemsResponse.data.data || itemsResponse.data || [];
        const categoriesData = categoriesResponse.data.data || categoriesResponse.data || [];
        setItems(itemsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        toast.error('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, JPG, and GIF images are allowed');
        return;
      }
      
      setItemImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setCreatingCategory(true);
      const response = await categoryService.createCategory({
        name: newCategoryName,
        description: ''
      });
      
      const newCategory = response.data.data || response.data;
      setCategories([...categories, newCategory]);
      setNewItem({ ...newItem, category_id: newCategory.id.toString() });
      setNewCategoryName('');
      setShowNewCategoryInput(false);
      toast.success('Category created successfully');
    } catch (error: any) {
      console.error('Error creating category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      toast.error(errorMessage);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate category is selected
    if (!newItem.category_id) {
      toast.error('Please select or create a category');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('description', newItem.description);
      formData.append('quantity', newItem.quantity.toString());
      formData.append('category_id', newItem.category_id);
      formData.append('status', newItem.status);
      
      if (itemImage) {
        formData.append('image', itemImage);
      }
      
      const response = await itemService.createItem(formData);
      toast.success(response.data.message || 'Item added successfully');
      
      // Reset form and close modal
      setShowAddModal(false);
      setNewItem({
        name: '',
        description: '',
        quantity: 0,
        category_id: '',
        status: 'available'
      });
      setItemImage(null);
      setImagePreview(null);
      setShowNewCategoryInput(false);
      setNewCategoryName('');
      
      // Refresh items list
      const itemsResponse = await itemService.getUserItems();
      const itemsData = itemsResponse.data.data || itemsResponse.data || [];
      setItems(itemsData);
    } catch (error: any) {
      console.error('Error adding item:', error);
      const apiMessage = error?.response?.data?.message;
      const apiErrors = error?.response?.data?.errors;
      const errorMessage = apiMessage
        ? apiMessage
        : apiErrors && typeof apiErrors === 'object'
          ? Object.values(apiErrors).flat().join(', ')
          : 'Failed to add item';
      toast.error(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewItem({
      name: '',
      description: '',
      quantity: 0,
      category_id: '',
      status: 'available'
    });
    setItemImage(null);
    setImagePreview(null);
    setShowNewCategoryInput(false);
    setNewCategoryName('');
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id);
        setItems(items.filter((item: any) => item.id !== id));
        toast.success('Item deleted successfully');
      } catch (error: any) {
        console.error('Error deleting item:', error);
        toast.error(error.response?.data?.message || 'Failed to delete item');
      }
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category_id.toString() === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <>
        <Navigation />
        <Loading text="Loading inventory data..." />
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
              <h1 className="text-3xl font-serif text-white">Inventory Management</h1>
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center justify-center px-6 py-2 rounded-md text-[#0d476b] font-semibold bg-cyan-400 hover:bg-cyan-500 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  Add New Item
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="w-full sm:w-1/3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-200">
                  Filter by Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 block w-full px-3 py-2 text-sm rounded-md bg-[#061b2f] text-white border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-2/3 sm:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-200">
                  Search Items
                </label>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="mt-1 block w-full px-3 py-2 text-sm rounded-md bg-[#061b2f] text-white placeholder:text-gray-400 border border-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="Search by name or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

      {/* Items List */}
            <div className="mt-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow-2xl overflow-hidden border border-cyan-700 rounded-xl">
              <table className="min-w-full divide-y divide-cyan-900">
                <thead className="bg-cyan-500/20">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-cyan-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#061b2f]/60 divide-y divide-cyan-900">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => {
                      const category = categories.find((c: any) => Number(c.id) === Number(item.category_id));
                      return (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {item.image && (
                                <div className="shrink-0 h-12 w-12 mr-4">
                                  <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${item.image}`}
                                    alt={item.name}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-semibold text-white">{item.name}</div>
                                <div className="text-sm text-gray-300">{item.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-200">{category ? category.name : item.category?.name || 'Unknown'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === 'available' ? 'bg-green-100 text-green-800' : 
                              item.status === 'borrowed' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status || 'available'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/inventory/${item.id}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/10 text-white hover:bg-white/15 border border-cyan-700 mr-2"
                            >
                              View
                            </Link>
                            {isAdmin && (
                              <>
                                <Link
                                  href={`/inventory/edit/${item.id}`}
                                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-cyan-400 text-[#0d476b] hover:bg-cyan-500 shadow-sm mr-2"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="inline-flex items-center px-3 py-1.5 rounded-md bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-300">
                        No items found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
            {showAddModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleCloseModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-10">
              <form onSubmit={handleAddItem}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Add New Item
                      </h3>
                      <div className="mt-2">
                        <div className="mb-4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={newItem.name}
                            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                          />
                        </div>
                        <div className="mb-4">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                          />
                        </div>
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            {!showNewCategoryInput && (
                              <button
                                type="button"
                                onClick={() => setShowNewCategoryInput(true)}
                                className="text-xs text-cyan-600 hover:text-cyan-500 font-semibold"
                              >
                                + Create New Category
                              </button>
                            )}
                          </div>
                          
                          {showNewCategoryInput ? (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Enter new category name"
                                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                  value={newCategoryName}
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleCreateNewCategory();
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={handleCreateNewCategory}
                                  disabled={creatingCategory || !newCategoryName.trim()}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-semibold rounded-md text-[#0d476b] bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  {creatingCategory ? 'Creating...' : 'Add'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowNewCategoryInput(false);
                                    setNewCategoryName('');
                                  }}
                                  className="inline-flex items-center px-3 py-2 border border-cyan-700 text-sm leading-4 font-semibold rounded-md text-white bg-[#0a2540] hover:bg-[#0b2d4f] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                                >
                                  Cancel
                                </button>
                              </div>
                              <p className="text-xs text-gray-600">Press Enter or click Add to create the category</p>
                            </div>
                          ) : (
                            <select
                              id="category"
                              name="category"
                              required
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                              value={newItem.category_id}
                              onChange={(e) => setNewItem({...newItem, category_id: e.target.value})}
                            >
                              <option value="">Select a category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                          <div className="mb-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                              type="number"
                              name="quantity"
                              id="quantity"
                            min="1"
                              required
                              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={newItem.quantity}
                            onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                            />
                          </div>
                          <div className="mb-4">
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                          <select
                            id="status"
                            name="status"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={newItem.status}
                            onChange={(e) => setNewItem({...newItem, status: e.target.value})}
                          >
                            <option value="available">Available</option>
                            <option value="borrowed">Borrowed</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Item Image (Optional)</label>
                          <div className="mt-1 flex items-center space-x-4">
                          {imagePreview && (
                            <div className="shrink-0">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded-lg border border-gray-300"
                              />
                            </div>
                          )}
                            <div className="flex-1">
                              <input
                                type="file"
                                id="image"
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Supported formats: JPEG, PNG, JPG, GIF (Max 2MB)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-md px-5 py-2 bg-green-500 text-base font-semibold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Item
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-cyan-700 shadow-sm px-5 py-2 bg-[#0a2540] text-base font-semibold text-white hover:bg-[#0b2d4f] focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCloseModal}
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
        </div>
      </div>
    </>
  );
}
