import React from 'react'
import ProtectedSuperAdminRoute from '@/components/common/ProtectedSuperAdminRoute'
import PaymentDetails from '@/components/pages/SuperAdmin/Payments'

export default function Payments() {
  return (
    <ProtectedSuperAdminRoute>
      <PaymentDetails/>
    </ProtectedSuperAdminRoute>
  )
}
