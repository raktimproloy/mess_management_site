'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { SearchAndFilter } from '@/components/common/SearchAndFilter';
import { DataTable } from '@/components/common/DataTable';
import { Pagination } from '@/components/common/Pagination';

export default function PaymentDetails() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    paymentType: '',
    status: '',
    paymentFor: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Generate mock payment data for now (replace with API call later)
  useEffect(() => {
    const mockPayments = [
      { 
        id: 1, 
        name: 'Michael Chen', 
        phone: '(617) 555-0123', 
        paymentType: 'bKash', 
        paymentNumber: '017********', 
        tranxId: 'TX789456123', 
        status: 'active', 
        paymentFor: 'sms', 
        packageName: '100 SMS Package',
        date: '2023-11-15',
        amount: 500
      },
      { 
        id: 2, 
        name: 'Sarah Williams', 
        phone: '(305) 555-0198', 
        paymentType: 'Nagad', 
        paymentNumber: '018********', 
        tranxId: 'TX321654987', 
        status: 'pending', 
        paymentFor: 'website', 
        packageName: 'Website Package',
        date: '2023-11-14',
        amount: 1500
      },
      { 
        id: 3, 
        name: 'David Miller', 
        phone: '(415) 555-0172', 
        paymentType: 'Rocket', 
        paymentNumber: '019********', 
        tranxId: 'TX147258369', 
        status: 'active', 
        paymentFor: 'sms', 
        packageName: '50 SMS Package',
        date: '2023-11-13',
        amount: 300
      },
      { 
        id: 4, 
        name: 'Jennifer Lopez', 
        phone: '(212) 555-0156', 
        paymentType: 'bKash', 
        paymentNumber: '017********', 
        tranxId: 'TX963852741', 
        status: 'active', 
        paymentFor: 'website', 
        packageName: 'Website Package',
        date: '2023-11-12',
        amount: 1500
      },
      { 
        id: 5, 
        name: 'Robert Garcia', 
        phone: '(312) 555-0141', 
        paymentType: 'Nagad', 
        paymentNumber: '018********', 
        tranxId: 'TX258369147', 
        status: 'pending', 
        paymentFor: 'sms', 
        packageName: '100 SMS Package',
        date: '2023-11-11',
        amount: 500
      },
      { 
        id: 6, 
        name: 'Maria Martinez', 
        phone: '(404) 555-0135', 
        paymentType: 'Rocket', 
        paymentNumber: '019********', 
        tranxId: 'TX654987321', 
        status: 'active', 
        paymentFor: 'sms', 
        packageName: '50 SMS Package',
        date: '2023-11-10',
        amount: 300
      },
      { 
        id: 7, 
        name: 'James Johnson', 
        phone: '(503) 555-0167', 
        paymentType: 'bKash', 
        paymentNumber: '017********', 
        tranxId: 'TX789123456', 
        status: 'pending', 
        paymentFor: 'website', 
        packageName: 'Website Package',
        date: '2023-11-09',
        amount: 1500
      },
      { 
        id: 8, 
        name: 'Linda Brown', 
        phone: '(713) 555-0189', 
        paymentType: 'Nagad', 
        paymentNumber: '018********', 
        tranxId: 'TX456789123', 
        status: 'active', 
        paymentFor: 'sms', 
        packageName: '100 SMS Package',
        date: '2023-11-08',
        amount: 500
      },
      { 
        id: 9, 
        name: 'William Davis', 
        phone: '(602) 555-0112', 
        paymentType: 'Rocket', 
        paymentNumber: '019********', 
        tranxId: 'TX159753486', 
        status: 'pending', 
        paymentFor: 'website', 
        packageName: 'Website Package',
        date: '2023-11-07',
        amount: 1500
      },
      { 
        id: 10, 
        name: 'Elizabeth Wilson', 
        phone: '(267) 555-0195', 
        paymentType: 'bKash', 
        paymentNumber: '017********', 
        tranxId: 'TX357159486', 
        status: 'active', 
        paymentFor: 'sms', 
        packageName: '50 SMS Package',
        date: '2023-11-06',
        amount: 300
      },
      { 
        id: 11, 
        name: 'Charles Taylor', 
        phone: '(619) 555-0178', 
        paymentType: 'Nagad', 
        paymentNumber: '018********', 
        tranxId: 'TX753159486', 
        status: 'pending', 
        paymentFor: 'sms', 
        packageName: '100 SMS Package',
        date: '2023-11-05',
        amount: 500
      },
      { 
        id: 12, 
        name: 'Patricia Anderson', 
        phone: '(347) 555-0132', 
        paymentType: 'Rocket', 
        paymentNumber: '019********', 
        tranxId: 'TX852741963', 
        status: 'active', 
        paymentFor: 'website', 
        packageName: 'Website Package',
        date: '2023-11-04',
        amount: 1500
      },
    ];
    setPayments(mockPayments);
    setTotalCount(mockPayments.length);
    setTotalPages(Math.ceil(mockPayments.length / limit));
    setLoading(false);
  }, []);

  // Handle search and filter functionality
  useEffect(() => {
    const filtered = payments.filter(payment => {
      const nameMatch = payment.name.toLowerCase().includes(searchTerm.toLowerCase());
      const phoneMatch = payment.phone.toLowerCase().includes(searchTerm.toLowerCase());
      const paymentNumberMatch = payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const tranxIdMatch = payment.tranxId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const paymentTypeMatch = filters.paymentType === '' || payment.paymentType.toLowerCase() === filters.paymentType;
      const statusMatch = filters.status === '' || payment.status === filters.status;
      const paymentForMatch = filters.paymentFor === '' || payment.paymentFor === filters.paymentFor;
      
      return nameMatch && phoneMatch && paymentNumberMatch && tranxIdMatch && 
             paymentTypeMatch && statusMatch && paymentForMatch;
    });
    
    setTotalCount(filtered.length);
    setTotalPages(Math.ceil(filtered.length / limit));
    setCurrentPage(1); // Reset to first page when search/filters change
  }, [searchTerm, filters, payments, limit]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (search) => {
    setSearchTerm(search);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      console.log(`Delete payment with ID: ${id}`);
      toast.success('Payment deleted successfully');
      // TODO: Implement actual delete functionality
    }
  };

  const handleEdit = (id) => {
    console.log(`Edit payment with ID: ${id}`);
    toast.info('Edit functionality coming soon');
  };

  const handleView = (id) => {
    console.log(`View payment with ID: ${id}`);
    toast.info('View functionality coming soon');
  };

  // Calculate current page data
  const startIndex = (currentPage - 1) * limit;
  const currentPayments = payments.filter(payment => {
    const nameMatch = payment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const phoneMatch = payment.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const paymentNumberMatch = payment.paymentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const tranxIdMatch = payment.tranxId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const paymentTypeMatch = filters.paymentType === '' || payment.paymentType.toLowerCase() === filters.paymentType;
    const statusMatch = filters.status === '' || payment.status === filters.status;
    const paymentForMatch = filters.paymentFor === '' || payment.paymentFor === filters.paymentFor;
    
    return nameMatch && phoneMatch && paymentNumberMatch && tranxIdMatch && 
           paymentTypeMatch && statusMatch && paymentForMatch;
  }).slice(startIndex, startIndex + limit);

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'Owner',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-400">{row.phone}</div>
        </div>
      )
    },
    {
      key: 'paymentType',
      label: 'Payment Details',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
              value === 'bKash' ? 'bg-orange-500' : 
              value === 'Nagad' ? 'bg-green-500' : 'bg-blue-500'
            }`}></span>
            <span className="font-medium">{value}</span>
          </div>
          <div className="text-sm text-gray-400">{row.paymentNumber}</div>
          <div className="text-sm text-gray-400">ID: {row.tranxId}</div>
          <div className="text-xs text-gray-500 mt-1">{row.date}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium w-fit mb-2 ${
            value === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
          }`}>
            {value === 'active' ? 'Active' : 'Pending'}
          </span>
          <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium w-fit ${
            row.paymentFor === 'website' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'
          }`}>
            {row.paymentFor === 'website' ? 'Website' : 'SMS'}
          </span>
        </div>
      )
    },
    {
      key: 'packageName',
      label: 'Package',
      sortable: true,
      render: (value, row) => (
        <span className="bg-gray-700 text-purple-400 py-1 px-2 rounded-md text-sm">
          {value}
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      type: 'currency',
      render: (value, row) => (
        <div className="text-right font-mono">${value.toLocaleString()}</div>
      )
    }
  ];

  // Define filter configuration
  const filterConfig = [
    {
      key: 'paymentType',
      label: 'Payment Type',
      type: 'select',
      options: [
        { value: '', label: 'All Types' },
        { value: 'bKash', label: 'bKash' },
        { value: 'Nagad', label: 'Nagad' },
        { value: 'Rocket', label: 'Rocket' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' }
      ]
    },
    {
      key: 'paymentFor',
      label: 'Payment For',
      type: 'select',
      options: [
        { value: '', label: 'All Purposes' },
        { value: 'website', label: 'Website' },
        { value: 'sms', label: 'SMS' }
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
        <title>Payment Details | Payment Management</title>
        <meta name="description" content="Payment details management" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Payment Details</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <SearchAndFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            searchPlaceholder="Search payments by name, phone, payment number, or transaction ID..."
            filterConfig={filterConfig}
            showClearButton={true}
          />
        </div>

        {/* Payment Table */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Payment Records</h2>
            <span className="text-sm text-gray-400">
              Total: {totalCount} payments
            </span>
          </div>

          <DataTable
            data={currentPayments}
            columns={columns}
            actions={actions}
            loading={loading}
            emptyMessage="No payments found matching your criteria."
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
    </div>
  );
}