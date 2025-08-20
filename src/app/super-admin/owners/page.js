import React from 'react'
import ProtectedSuperAdminRoute from '@/components/common/ProtectedSuperAdminRoute'
import OwnerManagement from '@/components/pages/Admin/Owners'

export default function Owners() {
  return (
    <ProtectedSuperAdminRoute>
      <OwnerManagement/>
    </ProtectedSuperAdminRoute>
  )
}
