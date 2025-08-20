'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function OwnerManagement() {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState({ name: '', phone: '', subdomain: '' });
  const [smsFilter, setSmsFilter] = useState('all');
  const itemsPerPage = 8;

  // Generate mock owner data
  useEffect(() => {
    const mockOwners = [
      { id: 1, name: 'Michael Chen', phone: '(617) 555-0123', subdomain: 'michael-student', smsActive: true, smsAmount: 250 },
      { id: 2, name: 'Sarah Williams', phone: '(305) 555-0198', subdomain: 'sarah-academy', smsActive: true, smsAmount: 500 },
      { id: 3, name: 'David Miller', phone: '(415) 555-0172', subdomain: 'david-learning', smsActive: false, smsAmount: 0 },
      { id: 4, name: 'Jennifer Lopez', phone: '(212) 555-0156', subdomain: 'jennifer-tutoring', smsActive: true, smsAmount: 120 },
      { id: 5, name: 'Robert Garcia', phone: '(312) 555-0141', subdomain: 'robert-education', smsActive: true, smsAmount: 350 },
      { id: 6, name: 'Maria Martinez', phone: '(404) 555-0135', subdomain: 'maria-school', smsActive: false, smsAmount: 0 },
      { id: 7, name: 'James Johnson', phone: '(503) 555-0167', subdomain: 'james-institute', smsActive: true, smsAmount: 420 },
      { id: 8, name: 'Linda Brown', phone: '(713) 555-0189', subdomain: 'linda-college', smsActive: true, smsAmount: 300 },
      { id: 9, name: 'William Davis', phone: '(602) 555-0112', subdomain: 'william-academy', smsActive: false, smsAmount: 0 },
      { id: 10, name: 'Elizabeth Wilson', phone: '(267) 555-0195', subdomain: 'elizabeth-learning', smsActive: true, smsAmount: 180 },
      { id: 11, name: 'Charles Taylor', phone: '(619) 555-0178', subdomain: 'charles-tutoring', smsActive: true, smsAmount: 600 },
      { id: 12, name: 'Patricia Anderson', phone: '(347) 555-0132', subdomain: 'patricia-education', smsActive: false, smsAmount: 0 },
      { id: 13, name: 'Christopher Moore', phone: '(786) 555-0145', subdomain: 'christopher-school', smsActive: true, smsAmount: 220 },
      { id: 14, name: 'Jessica Lee', phone: '(504) 555-0163', subdomain: 'jessica-institute', smsActive: true, smsAmount: 480 },
      { id: 15, name: 'Daniel Clark', phone: '(678) 555-0151', subdomain: 'daniel-college', smsActive: false, smsAmount: 0 },
      { id: 16, name: 'Susan Lewis', phone: '(832) 555-0128', subdomain: 'susan-academy', smsActive: true, smsAmount: 150 },
    ];
    setOwners(mockOwners);
    setFilteredOwners(mockOwners);
  }, []);

  // Handle search and filter functionality
  useEffect(() => {
    const filtered = owners.filter(owner => {
      const nameMatch = owner.name.toLowerCase().includes(searchTerm.name.toLowerCase());
      const phoneMatch = owner.phone.toLowerCase().includes(searchTerm.phone.toLowerCase());
      const subdomainMatch = owner.subdomain.toLowerCase().includes(searchTerm.subdomain.toLowerCase());
      
      let smsMatch = true;
      if (smsFilter === 'active') {
        smsMatch = owner.smsActive === true;
      } else if (smsFilter === 'inactive') {
        smsMatch = owner.smsActive === false;
      }
      
      return nameMatch && phoneMatch && subdomainMatch && smsMatch;
    });
    setFilteredOwners(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, smsFilter, owners]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOwners = filteredOwners.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle action buttons
  const handleView = (id) => {
    console.log(`View owner with ID: ${id}`);
    // Implement view functionality
  };

  const handleEdit = (id) => {
    console.log(`Edit owner with ID: ${id}`);
    // Implement edit functionality
  };

  const handleSmsToggle = (id) => {
    console.log(`Toggle SMS for owner with ID: ${id}`);
    // Implement SMS toggle functionality
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <Head>
        <title>Student Management | Owner Management</title>
        <meta name="description" content="Owner management system" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Owner Management</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-center">Search and Filter Owners</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="block text-sm font-medium mb-2">Search by Subdomain</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Subdomain"
                value={searchTerm.subdomain}
                onChange={(e) => setSearchTerm({...searchTerm, subdomain: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by SMS Status</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={smsFilter}
                onChange={(e) => setSmsFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">SMS Active</option>
                <option value="inactive">SMS Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Owner Table */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Owner List</h2>
            <span className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOwners.length)} of {filteredOwners.length} owners
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Subdomain</th>
                  <th className="px-4 py-3 text-center">SMS Active</th>
                  <th className="px-4 py-3 text-right">SMS Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOwners.length > 0 ? (
                  currentOwners.map((owner) => (
                    <tr key={owner.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3 font-medium">{owner.name}</td>
                      <td className="px-4 py-3">{owner.phone}</td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-700 text-purple-400 py-1 px-2 rounded-md text-sm">
                          {owner.subdomain}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center py-1 px-3 rounded-full text-xs font-medium ${owner.smsActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                          {owner.smsActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">{owner.smsAmount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(owner.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                            title="View Owner"
                          >
                            <i className="fas fa-eye mr-1"></i> View
                          </button>
                          <button
                            onClick={() => handleEdit(owner.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors text-sm"
                            title="Edit Owner"
                          >
                            <i className="fas fa-edit mr-1"></i> Edit
                          </button>
                          <button
                            onClick={() => handleSmsToggle(owner.id)}
                            className={`${owner.smsActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-purple-600 hover:bg-purple-700'} text-white px-3 py-1 rounded-lg transition-colors text-sm`}
                            title={owner.smsActive ? 'Deactivate SMS' : 'Activate SMS'}
                          >
                            <i className={`fas ${owner.smsActive ? 'fa-toggle-on' : 'fa-toggle-off'} mr-1`}></i> SMS
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                      No owners found matching your search criteria.
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