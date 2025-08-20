'use client'
import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

export default function PaymentConfirmation() {
  const router = useRouter();
  const { user, loading } = useAuth();
//   const { amount, plan, transactionId } = router.query;

  useEffect(() => {
    // Check authentication on component mount
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the page if user is not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Payment Confirmed | Student Management Pro</title>
        <meta name="description" content="Payment confirmation page" />
      </Head>

      <main className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-purple-900 to-indigo-900">
            <div className="flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.div>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-center">Payment Confirmed</h1>
            <p className="mt-2 text-center text-indigo-200">Thank you for your purchase!</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-8 text-center"
            >
              <h2 className="text-xl font-semibold">Your order is being processed</h2>
              <p className="mt-2 text-gray-400">We've sent a confirmation email with your order details</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-gray-700 p-4 rounded-lg"
              >
                <h3 className="text-sm font-medium text-gray-400">Plan</h3>
                <p className="mt-1 text-lg font-semibold">Student Management Pro</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="bg-gray-700 p-4 rounded-lg"
              >
                <h3 className="text-sm font-medium text-gray-400">Amount Paid</h3>
                <p className="mt-1 text-lg font-semibold">299.00</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mb-8 p-4 bg-gray-700 rounded-lg"
            >
              <h3 className="text-sm font-medium text-gray-400">Transaction ID</h3>
              <p className="mt-1 font-mono">ch_1JG8Z72eZvKYlo2C4gqJX1</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="p-4 bg-gray-700 rounded-lg mb-8"
            >
              <h3 className="text-lg font-semibold mb-4">What happens next?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold">1</span>
                  </div>
                  <p className="ml-3 text-gray-300">You'll receive a confirmation email within 5 minutes</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold">2</span>
                  </div>
                  <p className="ml-3 text-gray-300">Your account will be upgraded within 24 hours</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold">3</span>
                  </div>
                  <p className="ml-3 text-gray-300">Our team will contact you for onboarding</p>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300"
              >
                Back to Home
              </button>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-850 text-center">
            <p className="text-sm text-gray-500">
              Need help? <a href="#" className="text-indigo-400 hover:text-indigo-300">Contact our support team</a>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}