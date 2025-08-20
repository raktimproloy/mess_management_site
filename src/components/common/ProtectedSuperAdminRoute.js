'use client'
import { useSuperAdminAuth } from '@/hooks/useSuperAdminAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedSuperAdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useSuperAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/super-admin/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900 text-gray-200 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return children;
};

export default ProtectedSuperAdminRoute;
