'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function PaymentDetails() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState({ 
    name: '', 
    phone: '', 
    paymentNumber: '', 
    tranxId: '' 
  });
  const [filters, setFilters] = useState({
    paymentType: 'all',
    status: 'all',
    paymentFor: 'all'
  });
  const itemsPerPage = 8;

  // Generate mock payment data
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
    setFilteredPayments(mockPayments);
  }, []);

  // Handle search and filter functionality
  useEffect(() => {
    const filtered = payments.filter(payment => {
      const nameMatch = payment.name.toLowerCase().includes(searchTerm.name.toLowerCase());
      const phoneMatch = payment.phone.toLowerCase().includes(searchTerm.phone.toLowerCase());
      const paymentNumberMatch = payment.paymentNumber.toLowerCase().includes(searchTerm.paymentNumber.toLowerCase());
      const tranxIdMatch = payment.tranxId.toLowerCase().includes(searchTerm.tranxId.toLowerCase());
      
      const paymentTypeMatch = filters.paymentType === 'all' || payment.paymentType.toLowerCase() === filters.paymentType;
      const statusMatch = filters.status === 'all' || payment.status === filters.status;
      const paymentForMatch = filters.paymentFor === 'all' || payment.paymentFor === filters.paymentFor;
      
      return nameMatch && phoneMatch && paymentNumberMatch && tranxIdMatch && 
             paymentTypeMatch && statusMatch && paymentForMatch;
    });
    setFilteredPayments(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, filters, payments]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle action buttons
  const handleView = (id) => {
    console.log(`View payment with ID: ${id}`);
    // Implement view functionality
  };

  const handleEdit = (id) => {
    console.log(`Edit payment with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log(`Delete payment with ID: ${id}`);
    // Implement delete functionality
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <Head>
        <title>Student Management | Payment Details</title>
        <meta name="description" content="Payment details management" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Payment Details</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-center">Search and Filter Payments</h2>
          
          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Search by Name</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Owner name"
                value={searchTerm.name}
                onChange={(e) => setSearchTerm({...searchTerm, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search by Phone</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Phone number"
                value={searchTerm.phone}
                onChange={(e) => setSearchTerm({...searchTerm, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search by Payment Number</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Payment number"
                value={searchTerm.paymentNumber}
                onChange={(e) => setSearchTerm({...searchTerm, paymentNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search by Transaction ID</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Transaction ID"
                value={searchTerm.tranxId}
                onChange={(e) => setSearchTerm({...searchTerm, tranxId: e.target.value})}
              />
            </div>
          </div>
          
          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Payment Type</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.paymentType}
                onChange={(e) => setFilters({...filters, paymentType: e.target.value})}
              >
                <option value="all">All Types</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Payment For</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filters.paymentFor}
                onChange={(e) => setFilters({...filters, paymentFor: e.target.value})}
              >
                <option value="all">All Purposes</option>
                <option value="website">Website</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Table */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Payment Records</h2>
            <span className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-3 text-left">Owner</th>
                  <th className="px-4 py-3 text-left">Payment Details</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Package</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.length > 0 ? (
                  currentPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{payment.name}</div>
                          <div className="text-sm text-gray-400">{payment.phone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              payment.paymentType === 'bKash' ? 'bg-orange-500' : 
                              payment.paymentType === 'Nagad' ? 'bg-green-500' : 'bg-blue-500'
                            }`}></span>
                            <span className="font-medium">{payment.paymentType}</span>
                          </div>
                          <div className="text-sm text-gray-400">{payment.paymentNumber}</div>
                          <div className="text-sm text-gray-400">ID: {payment.tranxId}</div>
                          <div className="text-xs text-gray-500 mt-1">{payment.date}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium w-fit mb-2 ${
                            payment.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                          }`}>
                            {payment.status === 'active' ? 'Active' : 'Pending'}
                          </span>
                          <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium w-fit ${
                            payment.paymentFor === 'website' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'
                          }`}>
                            {payment.paymentFor === 'website' ? 'Website' : 'SMS'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-700 text-purple-400 py-1 px-2 rounded-md text-sm">
                          {payment.packageName}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">{formatCurrency(payment.amount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(payment.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                            title="View Payment"
                          >
                            <i className="fas fa-eye mr-1"></i> View
                          </button>
                          <button
                            onClick={() => handleEdit(payment.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                            title="Edit Payment"
                          >
                            <i className="fas fa-edit mr-1"></i> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(payment.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                            title="Delete Payment"
                          >
                            <i className="fas fa-trash mr-1"></i> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                      No payments found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Font Awesome Icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    </div>
  );
}