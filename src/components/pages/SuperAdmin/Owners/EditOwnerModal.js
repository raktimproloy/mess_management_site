'use client'
import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import toast from 'react-hot-toast';

const EditOwnerModal = ({ isOpen, onClose, owner, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subdomain: '',
    status: '',
    smsActivation: false,
    smsAmount: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (owner) {
      setFormData({
        name: owner.name || '',
        phone: owner.phone || '',
        subdomain: owner.subdomain || '',
        status: owner.status || 'active',
        smsActivation: owner.smsActivation || false,
        smsAmount: owner.smsAmount?.toString() || ''
      });
    }
  }, [owner]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/super-admin/owners/${owner.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          smsAmount: parseFloat(formData.smsAmount) || 0
        })
      });

      if (response.ok) {
        toast.success('Owner updated successfully');
        onUpdate();
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update owner');
      }
    } catch (error) {
      console.error('Error updating owner:', error);
      toast.error('Error updating owner');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get token from cookies
  const getAuthToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; superAdminToken=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  };

  if (!owner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Owner" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Basic Information</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
              Phone Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="subdomain" className="block text-sm font-medium text-gray-400 mb-1">Subdomain</label>
            <input
              type="text"
              id="subdomain"
              name="subdomain"
              value={formData.subdomain}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave empty for no subdomain"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* SMS Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">SMS Configuration</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="smsActivation"
              name="smsActivation"
              checked={formData.smsActivation}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="smsActivation" className="ml-2 text-sm text-gray-300">
              Enable SMS functionality
            </label>
          </div>
          
          <div>
            <label htmlFor="smsAmount" className="block text-sm font-medium text-gray-400 mb-1">SMS Amount</label>
            <input
              type="number"
              id="smsAmount"
              name="smsAmount"
              value={formData.smsAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Owner'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditOwnerModal;
