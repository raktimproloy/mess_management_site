'use client'
import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import toast from 'react-hot-toast';

const EditStudentModal = ({ isOpen, onClose, student, onUpdate, categories, owners }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    smsPhone: '',
    status: '',
    categoryId: '',
    ownerId: '',
    referenceId: '',
    discountId: '',
    discountAmount: '',
    bookingAmount: '',
    joiningDate: '',
    hideRanking: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        phone: student.phone || '',
        smsPhone: student.smsPhone || '',
        status: student.status || 'living',
        categoryId: student.categoryId?.toString() || '',
        ownerId: student.ownerId?.toString() || '',
        referenceId: student.referenceId || '',
        discountId: student.discountId || '',
        discountAmount: student.discountAmount?.toString() || '',
        bookingAmount: student.bookingAmount?.toString() || '',
        joiningDate: student.joiningDate ? new Date(student.joiningDate).toISOString().split('T')[0] : '',
        hideRanking: student.hideRanking === 1 || student.hideRanking === true
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.categoryId || !formData.ownerId) {
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

      const response = await fetch(`/api/super-admin/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          categoryId: parseInt(formData.categoryId),
          ownerId: parseInt(formData.ownerId),
          discountAmount: parseFloat(formData.discountAmount) || 0,
          bookingAmount: parseFloat(formData.bookingAmount) || 0,
          hideRanking: formData.hideRanking ? 1 : 0,
          referenceId: formData.referenceId === '' ? null : formData.referenceId,
          discountId: formData.discountId === '' ? null : formData.discountId
        })
      });

      if (response.ok) {
        toast.success('Student updated successfully');
        onUpdate();
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Error updating student');
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

  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Student" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label htmlFor="smsPhone" className="block text-sm font-medium text-gray-400 mb-1">SMS Phone</label>
              <input
                type="tel"
                id="smsPhone"
                name="smsPhone"
                value={formData.smsPhone}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <option value="living">Living</option>
                <option value="left">Left</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Additional Details</h3>
            
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-400 mb-1">
                Category <span className="text-red-400">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title} (${category.rentAmount})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="ownerId" className="block text-sm font-medium text-gray-400 mb-1">
                Owner <span className="text-red-400">*</span>
              </label>
              <select
                id="ownerId"
                name="ownerId"
                value={formData.ownerId}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Owner</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} ({owner.subdomain || 'No subdomain'})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="referenceId" className="block text-sm font-medium text-gray-400 mb-1">Reference ID</label>
              <input
                type="text"
                id="referenceId"
                name="referenceId"
                value={formData.referenceId}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="discountId" className="block text-sm font-medium text-gray-400 mb-1">Discount ID</label>
              <input
                type="text"
                id="discountId"
                name="discountId"
                value={formData.discountId}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty for no discount"
              />
            </div>
            
            <div>
              <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-400 mb-1">Joining Date</label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-400 mb-1">Discount Amount</label>
              <input
                type="number"
                id="discountAmount"
                name="discountAmount"
                value={formData.discountAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="bookingAmount" className="block text-sm font-medium text-gray-400 mb-1">Booking Amount</label>
              <input
                type="number"
                id="bookingAmount"
                name="bookingAmount"
                value={formData.bookingAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Options</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hideRanking"
              name="hideRanking"
              checked={formData.hideRanking}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="hideRanking" className="ml-2 text-sm text-gray-300">
              Hide from ranking
            </label>
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
            {isSubmitting ? 'Updating...' : 'Update Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditStudentModal;
