'use client'
import Modal from '@/components/common/Modal';

const ViewStudentModal = ({ isOpen, onClose, student }) => {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Details" size="lg">
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <p className="text-white">{student.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              <p className="text-white font-mono">{student.phone}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">SMS Phone</label>
              <p className="text-white font-mono">{student.smsPhone || 'N/A'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${
                student.status === 'living' ? 'bg-green-900 text-green-300' : 
                student.status === 'left' ? 'bg-red-900 text-red-300' : 
                'bg-gray-700 text-gray-300'
              }`}>
                {student.status === 'living' ? 'Living' : student.status === 'left' ? 'Left' : student.status}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Joining Date</label>
              <p className="text-white">{new Date(student.joiningDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Additional Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Profile Image</label>
              <p className="text-white">{student.profileImage || 'No image uploaded'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Hide Ranking</label>
              <p className="text-white">{student.hideRanking ? 'Yes' : 'No'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Reference ID</label>
              <p className="text-white">{student.referenceId || 'N/A'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Booking Amount</label>
              <p className="text-white">${student.bookingAmount || 0}</p>
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Owner Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Owner Name</label>
              <p className="text-white">{student.owner?.name || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Owner Phone</label>
              <p className="text-white font-mono">{student.owner?.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Subdomain</label>
              <p className="text-white">{student.owner?.subdomain || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Category Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Category Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category Title</label>
              <p className="text-white">{student.categoryRef?.title || 'N/A'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Rent Amount</label>
              <p className="text-white">${student.categoryRef?.rentAmount || 0}</p>
            </div>
          </div>
        </div>

        {/* Discount Information */}
        {student.discountRef && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Discount Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Discount Title</label>
                <p className="text-white">{student.discountRef.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Discount Amount</label>
                <p className="text-white">${student.discountRef.discountAmount || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Timestamps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Created At</label>
              <p className="text-white">{new Date(student.createdAt).toLocaleString()}</p>
            </div>
            {student.updatedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Last Updated</label>
                <p className="text-white">{new Date(student.updatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewStudentModal;
