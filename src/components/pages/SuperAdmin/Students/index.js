'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { useSuperAdminAuth } from '@/hooks/useSuperAdminAuth';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';
import ViewStudentModal from './ViewStudentModal';
import EditStudentModal from './EditStudentModal';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function StudentList() {
  const { user, loading: authLoading, isAuthenticated } = useSuperAdminAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    owner: '',
    status: '',
    categoryId: '',
    ownerId: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [owners, setOwners] = useState([]);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Helper function to get token from cookies
  const getAuthToken = () => {
    const value = `; ${document.cookie}`;
    console.log('getAuthToken: All cookies:', document.cookie);
    const parts = value.split(`; superAdminToken=`);
    console.log('getAuthToken: Cookie parts:', parts);
    if (parts.length === 2) {
      const token = parts.pop().split(';').shift();
      console.log('getAuthToken: Token extracted:', token ? 'yes' : 'no');
      if (token) {
        console.log('getAuthToken: Token length:', token.length);
        console.log('getAuthToken: Token preview:', token.substring(0, 20) + '...');
      }
      return token;
    }
    console.log('getAuthToken: No token found in cookies');
    return null;
  };

  // Fetch categories and owners for filters - only when authenticated
  useEffect(() => {
    console.log('Students component - auth state:', { isAuthenticated, authLoading });
    if (isAuthenticated && !authLoading) {
      console.log('Students component - fetching categories and owners');
      fetchCategories();
      fetchOwners();
    }
  }, [isAuthenticated, authLoading]);

  // Fetch students when filters, search, or pagination changes - only when authenticated
  useEffect(() => {
    console.log('Students component - fetch students effect:', { isAuthenticated, authLoading, currentPage, limit });
    if (isAuthenticated && !authLoading) {
      console.log('Students component - fetching students');
      fetchStudents();
    }
  }, [currentPage, limit, filters, searchTerm, isAuthenticated, authLoading]);

  const fetchCategories = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch('/api/super-admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      } else {
        console.error('Failed to fetch categories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchOwners = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch('/api/super-admin/owners?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOwners(data.data || []);
      } else {
        console.error('Failed to fetch owners:', response.status);
      }
    } catch (error) {
      console.error('Error fetching owners:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      console.log('fetchStudents: Token found:', token ? 'yes' : 'no');
      if (!token) {
        console.error('fetchStudents: No auth token found');
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
        ...(filters.owner && { owner: filters.owner }),
        ...(filters.status && { status: filters.status }),
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.ownerId && { ownerId: filters.ownerId })
      });

      console.log('fetchStudents: Making API call with token:', token.substring(0, 20) + '...');
      const response = await fetch(`/api/super-admin/students?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('fetchStudents: API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.totalCount || 0);
      } else {
        toast.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('fetchStudents: Error:', error);
      toast.error('Error fetching students');
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
    const student = students.find(s => s.id === id);
    setSelectedStudent(student);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent) return;

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const response = await fetch(`/api/super-admin/students/${selectedStudent.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Student deleted successfully');
        fetchStudents(); // Refresh the list
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Error deleting student');
    }
  };

  const handleEdit = (id) => {
    const student = students.find(s => s.id === id);
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  const handleView = (id) => {
    const student = students.find(s => s.id === id);
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const handleUpdate = () => {
    fetchStudents(); // Refresh the list
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
      key: 'owner',
      label: 'Owner',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{row.owner?.name || 'N/A'}</div>
          <div className="text-sm text-gray-400">{row.owner?.subdomain || ''}</div>
        </div>
      )
    },
    {
      key: 'categoryRef',
      label: 'Category',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{row.categoryRef?.title || 'N/A'}</div>
          <div className="text-sm text-gray-400">${row.categoryRef?.rentAmount || 0}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, row) => (
        <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${
          value === 'living' ? 'bg-green-900 text-green-300' : 
          value === 'left' ? 'bg-red-900 text-red-300' : 
          'bg-gray-700 text-gray-300'
        }`}>
          {value === 'living' ? 'Living' : value === 'left' ? 'Left' : value}
        </span>
      )
    },
    {
      key: 'joiningDate',
      label: 'Joining Date',
      sortable: true,
      type: 'date',
      render: (value, row) => (
        <div className="text-sm">
          {new Date(value).toLocaleDateString()}
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
      key: 'ownerId',
      label: 'Owner',
      type: 'select',
      options: [
        { value: '', label: 'All Owners' },
        ...owners.map(owner => ({
          value: owner.id.toString(),
          label: `${owner.name} (${owner.subdomain})`
        }))
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'living', label: 'Living' },
        { value: 'left', label: 'Left' }
      ]
    },
    {
      key: 'categoryId',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'All Categories' },
        ...categories.map(category => ({
          value: category.id.toString(),
          label: `${category.title} ($${category.rentAmount})`
        }))
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
        <title>Student Management | Student List</title>
        <meta name="description" content="Student management system" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Student Management</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <SearchAndFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            searchPlaceholder="Search students by name, phone, or owner..."
            filterConfig={filterConfig}
            showClearButton={true}
          />
        </div>

        {/* Student Table */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Student List</h2>
            <span className="text-sm text-gray-400">
              Total: {totalCount} students
            </span>
          </div>

          <DataTable
            data={students}
            columns={columns}
            actions={actions}
            loading={loading}
            emptyMessage="No students found matching your criteria."
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
       <ViewStudentModal
         isOpen={viewModalOpen}
         onClose={() => setViewModalOpen(false)}
         student={selectedStudent}
       />
       
       <EditStudentModal
         isOpen={editModalOpen}
         onClose={() => setEditModalOpen(false)}
         student={selectedStudent}
         onUpdate={handleUpdate}
         categories={categories}
         owners={owners}
       />
       
       <ConfirmModal
         isOpen={deleteModalOpen}
         onClose={() => setDeleteModalOpen(false)}
         onConfirm={confirmDelete}
         title="Delete Student"
         message={`Are you sure you want to delete "${selectedStudent?.name}"? This action cannot be undone.`}
         confirmText="Delete Student"
         type="danger"
       />
     </div>
   );
 }