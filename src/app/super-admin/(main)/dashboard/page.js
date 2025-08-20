import React from 'react'
import ProtectedSuperAdminRoute from '@/components/common/ProtectedSuperAdminRoute'

export default function SuperAdminDashboard() {
  return (
    <ProtectedSuperAdminRoute>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-blue-100">Welcome to the ultimate control panel</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500 rounded-lg">
                <span className="text-2xl">👨‍🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Students</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-green-500 rounded-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Owners</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Payments</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 bg-red-500 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold">$0</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="text-gray-400 text-center py-8">
            <p>No recent activity to display</p>
          </div>
        </div>
      </div>
    </ProtectedSuperAdminRoute>
  )
}
