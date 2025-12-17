'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { itemService, categoryService } from '@/lib/api';
import { toast } from 'react-toastify';
import { BackButton } from '@/components/ui/BackButton';
import { Loading } from '@/components/ui/Loading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function EditItem() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const itemId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    category_id: '',
    status: 'available',
    image: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/inventory');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemResponse, categoriesResponse] = await Promise.all([
          itemService.getById(parseInt(itemId)),
          categoryService.getUserCategories()
        ]);
        
        const itemData = itemResponse.data.data || itemResponse.data;
        const categoriesData = categoriesResponse.data.data || categoriesResponse.data || [];
        
        setItem(itemData);
        setCategories(categoriesData);
        setFormData({
          name: itemData.name || '',
          description: itemData.description || '',
          quantity: itemData.quantity || 0,
          category_id: itemData.category_id?.toString() || '',
          status: itemData.status || 'available',
          image: null
        });
        
        if (itemData.image) {
          setImagePreview(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${itemData.image}`);
        }
      } catch (error: any) {
        console.error('Error fetching item data:', error);
        toast.error(error.response?.data?.message || 'Failed to load item data');
        router.push('/inventory');
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchData();
    }
  }, [itemId, isAdmin, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('quantity', formData.quantity.toString());
      data.append('category_id', formData.category_id);
      data.append('status', formData.status);
      
      if (formData.image) {
        data.append('image', formData.image);
      }
      
      const response = await itemService.update(parseInt(itemId), data);
      toast.success(response.data.message || 'Item updated successfully');
      router.push(`/inventory/${itemId}`);
    } catch (error: any) {
      console.error('Error updating item:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(', ')
        : 'Failed to update item';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading text="Loading item data..." />;
  }

  if (!item) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-900">Item not found</h2>
        <BackButton href="/inventory" className="mt-4 inline-flex" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton href={`/inventory/${itemId}`} label="Back to Item Details" className="mb-4" />
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Edit Item</h1>
          <p className="mt-1 text-sm text-gray-500">Update item information and details</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="name"
                type="text"
                label="Item Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter item name"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter item description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category_id"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Input
                  id="quantity"
                  type="number"
                  label="Quantity"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="Enter quantity"
                />
              </div>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Item Image
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview && (
                  <div className="flex-shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-300"
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

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push(`/inventory/${itemId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={saving}
              >
                Update Item
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

