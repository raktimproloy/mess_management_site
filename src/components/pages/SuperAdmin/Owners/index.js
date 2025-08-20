'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useSuperAdminAuth } from '@/hooks/useSuperAdminAuth';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import ViewOwnerModal from './ViewOwnerModal';
import EditOwnerModal from './EditOwnerModal';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function OwnerManagement() {
  const { user, loading: authLoading, isAuthenticated } = useSuperAdminAuth();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    subdomain: '',
    status: '',
    smsActivation: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);

  // Helper function to get token from cookies
  const getAuthToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; superAdminToken=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  };

  // Fetch owners when filters, search, or pagination changes - only when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchOwners();
    }
  }, [currentPage, limit, filters, searchTerm, isAuthenticated, authLoading]);

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No auth token found');
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.name && { name: filters.name }),
        ...(filters.phone && { phone: filters.phone }),
        ...(filters.subdomain && { subdomain: filters.subdomain }),
        ...(filters.status && { status: filters.status }),
        ...(filters.smsActivation !== '' && { smsActivation: filters.smsActivation })
      });

      const response = await fetch(`/api/super-admin/owners?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOwners(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
      } else {
        toast.error('Failed to fetch owners');
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast.error('Error fetching owners');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when limit changes
  };

  const handleDelete = async (id) => {
    const owner = owners.find(o => o.id === id);
    setSelectedOwner(owner);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedOwner) return;

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/super-admin/owners/${selectedOwner.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Owner deleted successfully');
        fetchOwners(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete owner');
      }
    } catch (error) {
      console.error('Error deleting owner:', error);
      toast.error('Error deleting owner');
    }
  };

  const handleEdit = (id) => {
    const owner = owners.find(o => o.id === id);
    setSelectedOwner(owner);
    setEditModalOpen(true);
  };

  const handleView = (id) => {
    const owner = owners.find(o => o.id === id);
    setSelectedOwner(owner);
    setViewModalOpen(true);
  };

  const handleUpdate = () => {
    fetchOwners(); // Refresh the list
  };

  const handleSmsToggle = async (id) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const owner = owners.find(o => o.id === id);
      const newSmsActivation = !owner.smsActivation;

      const response = await fetch(`/api/super-admin/owners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          smsActivation: newSmsActivation
        })
      });

      if (response.ok) {
        toast.success(`SMS ${newSmsActivation ? 'activated' : 'deactivated'} successfully`);
        fetchOwners(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update SMS status');
      }
    } catch (error) {
      console.error('Error updating SMS status:', error);
      toast.error('Error updating SMS status');
    }
  };

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-400">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value, row) => (
        <div className="font-mono">{value}</div>
      )
    },
    {
      key: 'subdomain',
      label: 'Subdomain',
      sortable: true,
      render: (value, row) => (
        <span className="bg-gray-700 text-purple-400 py-1 px-2 rounded-md text-sm">
          {value || 'N/A'}
        </span>
      )
    },
    {
      key: 'smsActivation',
      label: 'SMS Status',
      sortable: true,
      type: 'boolean',
      render: (value, row) => (
        <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${
          value ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'smsAmount',
      label: 'SMS Amount',
      sortable: true,
      type: 'currency',
      render: (value, row) => (
        <div className="text-right font-mono">${value?.toLocaleString() || 0}</div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, row) => (
        <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-green-900 text-green-300' : 
          value === 'inactive' ? 'bg-red-900 text-red-300' : 
          'bg-gray-700 text-gray-300'
        }`}>
          {value === 'active' ? 'Active' : value === 'inactive' ? 'Inactive' : value}
        </span>
      )
    },
    {
      key: '_count',
      label: 'Stats',
      sortable: false,
      render: (value, row) => (
        <div className="text-sm text-gray-400">
          <div>Students: {row._count?.students || 0}</div>
          <div>Categories: {row._count?.categories || 0}</div>
        </div>
      )
    }
  ];

  // Define filter configuration
  const filterConfig = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Search by name'
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'text',
      placeholder: 'Search by phone'
    },
    {
      key: 'subdomain',
      label: 'Subdomain',
      type: 'text',
      placeholder: 'Search by subdomain'
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'smsActivation',
      label: 'SMS Status',
      type: 'select',
      options: [
        { value: '', label: 'All SMS Statuses' },
        { value: 'true', label: 'SMS Active' },
        { value: 'false', label: 'SMS Inactive' }
      ]
    }
  ];

  // Define table actions
  const actions = [
    {
      label: 'View',
      onClick: handleView,
      className: 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors text-sm',
      icon: '👁️'
    },
    {
      label: 'Edit',
      onClick: handleEdit,
      className: 'bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors text-sm',
      icon: '✏️'
    },
    {
      label: 'Toggle SMS',
      onClick: handleSmsToggle,
      className: 'bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition-colors text-sm',
      icon: '📱'
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      className: 'bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors text-sm',
      icon: '🗑️',
      confirm: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <Head>
        <title>Owner Management | Owner Management</title>
        <meta name="description" content="Owner management system" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Owner Management</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <SearchAndFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            searchPlaceholder="Search owners by name, phone, or subdomain..."
            filterConfig={filterConfig}
            showClearButton={true}
          />
        </div>

        {/* Owner Table */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Owner List</h2>
            <span className="text-sm text-gray-400">
              Total: {totalCount} owners
            </span>
          </div>

          <DataTable
            data={owners}
            columns={columns}
            actions={actions}
            loading={loading}
            emptyMessage="No owners found matching your criteria."
            selectable={false}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                showPageSize={true}
                showJumpToPage={true}
                showInfo={true}
              />
            </div>
                     )}
         </div>
       </div>

       {/* Modals */}
       <ViewOwnerModal
         isOpen={viewModalOpen}
         onClose={() => setViewModalOpen(false)}
         owner={selectedOwner}
       />
       
       <EditOwnerModal
         isOpen={editModalOpen}
         onClose={() => setEditModalOpen(false)}
         owner={selectedOwner}
         onUpdate={handleUpdate}
       />
       
       <ConfirmModal
         isOpen={deleteModalOpen}
         onClose={() => setDeleteModalOpen(false)}
         onConfirm={confirmDelete}
         title="Delete Owner"
         message={`Are you sure you want to delete "${selectedOwner?.name}"? This action cannot be undone.`}
         confirmText="Delete Owner"
         type="danger"
       />
     </div>
   );
 }