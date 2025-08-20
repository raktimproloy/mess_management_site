import React from 'react'
import ProtectedSuperAdminRoute from '@/components/common/ProtectedSuperAdminRoute'
import PaymentDetails from '@/components/pages/Admin/Payments'

export default function Payments() {
  return (
    <ProtectedSuperAdminRoute>
      <PaymentDetails/>
    </ProtectedSuperAdminRoute>
  )
}
