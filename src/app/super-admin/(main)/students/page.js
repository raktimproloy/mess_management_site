import React from 'react'
import ProtectedSuperAdminRoute from '@/components/common/ProtectedSuperAdminRoute'
import StudentsPage from '@/components/pages/SuperAdmin/Students'

export default function Students() {
  return (
    <ProtectedSuperAdminRoute>
      <StudentsPage/>
    </ProtectedSuperAdminRoute>
  )
}
