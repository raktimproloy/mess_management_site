'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState({ name: '', phone: '', owner: '' });
  const itemsPerPage = 8;

  // Generate mock student data
  useEffect(() => {
    const mockStudents = [
      { id: 1, name: 'Emma Johnson', phone: '(617) 555-0123', owner: 'Michael Chen' },
      { id: 2, name: 'Noah Smith', phone: '(305) 555-0198', owner: 'Sarah Williams' },
      { id: 3, name: 'Olivia Davis', phone: '(415) 555-0172', owner: 'David Miller' },
      { id: 4, name: 'Liam Brown', phone: '(212) 555-0156', owner: 'Jennifer Lopez' },
      { id: 5, name: 'Ava Wilson', phone: '(312) 555-0141', owner: 'Robert Garcia' },
      { id: 6, name: 'William Taylor', phone: '(404) 555-0135', owner: 'Maria Martinez' },
      { id: 7, name: 'Sophia Anderson', phone: '(503) 555-0167', owner: 'James Johnson' },
      { id: 8, name: 'Mason Thomas', phone: '(713) 555-0189', owner: 'Linda Brown' },
      { id: 9, name: 'Isabella Jackson', phone: '(602) 555-0112', owner: 'William Davis' },
      { id: 10, name: 'James White', phone: '(267) 555-0195', owner: 'Elizabeth Wilson' },
      { id: 11, name: 'Charlotte Harris', phone: '(619) 555-0178', owner: 'Charles Taylor' },
      { id: 12, name: 'Benjamin Martin', phone: '(347) 555-0132', owner: 'Patricia Anderson' },
      { id: 13, name: 'Amelia Thompson', phone: '(786) 555-0145', owner: 'Christopher Moore' },
      { id: 14, name: 'Lucas Garcia', phone: '(504) 555-0163', owner: 'Jessica Lee' },
      { id: 15, name: 'Mia Martinez', phone: '(678) 555-0151', owner: 'Daniel Clark' },
      { id: 16, name: 'Henry Rodriguez', phone: '(832) 555-0128', owner: 'Susan Lewis' },
      { id: 17, name: 'Evelyn Lewis', phone: '(918) 555-0147', owner: 'Joseph Walker' },
      { id: 18, name: 'Alexander Lee', phone: '(650) 555-0192', owner: 'Margaret Hall' },
      { id: 19, name: 'Harper Walker', phone: '(216) 555-0138', owner: 'Thomas Allen' },
      { id: 20, name: 'Leo Hall', phone: '(757) 555-0175', owner: 'Sarah Young' },
    ];
    setStudents(mockStudents);
    setFilteredStudents(mockStudents);
  }, []);

  // Handle search functionality
  useEffect(() => {
    const filtered = students.filter(student => {
      const nameMatch = student.name.toLowerCase().includes(searchTerm.name.toLowerCase());
      const phoneMatch = student.phone.toLowerCase().includes(searchTerm.phone.toLowerCase());
      const ownerMatch = student.owner.toLowerCase().includes(searchTerm.owner.toLowerCase());
      return nameMatch && phoneMatch && ownerMatch;
    });
    setFilteredStudents(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, students]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle action buttons
  const handleView = (id) => {
    console.log(`View student with ID: ${id}`);
    // Implement view functionality
  };

  const handleEdit = (id) => {
    console.log(`Edit student with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log(`Delete student with ID: ${id}`);
    // Implement delete functionality
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <Head>
        <title>Student Management | Student List</title>
        <meta name="description" content="Student management system" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Student Management</h1>
        
        {/* Search Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-center">Search Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search by Name</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Student name"
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
              <label className="block text-sm font-medium mb-2">Search by Owner</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Owner name"
                value={searchTerm.owner}
                onChange={(e) => setSearchTerm({...searchTerm, owner: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Student List</h2>
            <span className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Owner</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">{student.phone}</td>
                      <td className="px-4 py-3">{student.owner}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleView(student.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(student.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-gray-400">
                      No students found matching your search criteria.
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
    </div>
  );
}