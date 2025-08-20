'use client'
import Modal from '@/components/common/Modal';

const ViewOwnerModal = ({ isOpen, onClose, owner }) => {
  if (!owner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Owner Details" size="lg">
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <p className="text-white">{owner.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              <p className="text-white font-mono">{owner.phone}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Subdomain</label>
              <p className="text-white">{owner.subdomain || 'No subdomain assigned'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${
                owner.status === 'active' ? 'bg-green-900 text-green-300' : 
                owner.status === 'inactive' ? 'bg-red-900 text-red-300' : 
                'bg-gray-700 text-gray-300'
              }`}>
                {owner.status === 'active' ? 'Active' : owner.status === 'inactive' ? 'Inactive' : owner.status}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">SMS Configuration</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">SMS Activation</label>
              <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${
                owner.smsActivation ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}>
                {owner.smsActivation ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">SMS Amount</label>
              <p className="text-white">${owner.smsAmount?.toLocaleString() || 0}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Created At</label>
              <p className="text-white">{new Date(owner.createdAt).toLocaleString()}</p>
            </div>
            
            {owner.updatedAt && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Last Updated</label>
                <p className="text-white">{new Date(owner.updatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{owner._count?.students || 0}</div>
              <div className="text-sm text-gray-400">Students</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{owner._count?.categories || 0}</div>
              <div className="text-sm text-gray-400">Categories</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{owner._count?.rents || 0}</div>
              <div className="text-sm text-gray-400">Rents</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{owner._count?.complaints || 0}</div>
              <div className="text-sm text-gray-400">Complaints</div>
            </div>
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

export default ViewOwnerModal;
