'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const CheckoutPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [selectedSmsPackage, setSelectedSmsPackage] = useState(null);
  const [subdomain, setSubdomain] = useState('');
  const [subdomainError, setSubdomainError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const smsPackages = [
    {
      id: 'basic',
      name: 'Basic SMS',
      volume: '50 SMS/month',
      price: 10,
      period: 'Monthly',
      features: ['Standard delivery', 'Basic analytics'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'standard',
      name: 'Standard SMS',
      volume: '100 SMS/month',
      price: 15,
      period: 'Monthly',
      features: ['Priority delivery', 'Advanced analytics', 'Templates'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'premium',
      name: 'Premium SMS',
      volume: '150 SMS/month',
      price: 20,
      period: 'Monthly',
      features: ['Highest priority', 'Full analytics', 'Dedicated number'],
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'unlimited',
      name: 'Unlimited SMS',
      volume: 'Unlimited messages',
      price: 30,
      period: 'Monthly',
      features: ['Unlimited messages', '24/7 support', 'Custom templates'],
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'yearly-basic',
      name: 'Basic Yearly',
      volume: '50 SMS/month',
      price: 102,
      period: 'Yearly (Save 15%)',
      features: ['Standard delivery', 'Basic analytics'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'yearly-standard',
      name: 'Standard Yearly',
      volume: '100 SMS/month',
      price: 153,
      period: 'Yearly (Save 15%)',
      features: ['Priority delivery', 'Advanced analytics', 'Templates'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'yearly-premium',
      name: 'Premium Yearly',
      volume: '150 SMS/month',
      price: 204,
      period: 'Yearly (Save 15%)',
      features: ['Highest priority', 'Full analytics', 'Dedicated number'],
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const validateSubdomain = () => {
    if (!subdomain) {
      setSubdomainError('Subdomain is required');
      return false;
    }
    
    if (subdomain.length < 3) {
      setSubdomainError('Subdomain must be at least 3 characters');
      return false;
    }
    
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      setSubdomainError('Only lowercase letters, numbers, and hyphens allowed');
      return false;
    }
    
    setSubdomainError('');
    return true;
  };

  const handleCheckout = () => {
    if (!validateSubdomain()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/pricing/payment');
    }, 2000);
  };

  const calculateTotal = () => {
    let total = 100; // Base template price
    
    if (selectedSmsPackage) {
      const sms = smsPackages.find(p => p.id === selectedSmsPackage);
      total += sms.price;
    }
    
    return total;
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
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
    <div className="min-h-screen py-32 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>Checkout | EduFlow - Student Management Solutions</title>
        <meta name="description" content="Complete your purchase of our student management solution" />
      </Head>

      {/* Main Content */}
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Configuration */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Lifetime Access Template
              </h2>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-800/50 p-4 rounded-xl mb-6">
                <div>
                  <h3 className="font-bold">Student Management Template</h3>
                  <p className="text-gray-400">One-time purchase with lifetime access</p>
                </div>
                <div className="text-xl font-bold mt-2 sm:mt-0">$100.00</div>
              </div>
              
              <p className="text-gray-300 mb-6">
                This purchase includes full access to our premium student management website template 
                with lifetime updates and 1 year of priority support.
              </p>
              
              <div className="flex items-center text-green-400 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>One-time payment - No recurring charges</span>
              </div>
            </motion.div>
            
            {/* SMS Package Selection */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Add SMS Notification Package
              </h2>
              
              <p className="text-gray-300 mb-6">
                Enhance your student management system with SMS notifications. 
                Select one package to add to your purchase.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {smsPackages.map((pkg) => (
                  <motion.div
                    key={pkg.id}
                    whileHover={{ y: -5 }}
                    className={`bg-gray-800/50 rounded-xl border ${
                      selectedSmsPackage === pkg.id 
                        ? 'border-blue-500 ring-2 ring-blue-500' 
                        : 'border-gray-700 hover:border-gray-600'
                    } p-4 cursor-pointer transition-all`}
                    onClick={() => setSelectedSmsPackage(pkg.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{pkg.name}</h3>
                        <p className="text-gray-400">{pkg.volume}</p>
                      </div>
                      <div className="text-xl font-bold">${pkg.price}</div>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">{pkg.period}</div>
                    
                    <div className="mt-4">
                      <ul className="text-sm space-y-1">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {selectedSmsPackage && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 px-4 py-2 text-blue-400 hover:text-blue-300"
                  onClick={() => setSelectedSmsPackage(null)}
                >
                  Remove SMS Package
                </motion.button>
              )}
            </motion.div>
            
            {/* Subdomain Configuration */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your Subdomain
              </h2>
              
              <div className="flex items-end">
                <div className="flex-1 mr-4">
                  <label className="block text-gray-400 mb-2">Choose your subdomain</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value)}
                      className={`w-full bg-gray-800 border ${
                        subdomainError ? 'border-red-500' : 'border-gray-700'
                      } rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="yourschool"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      .eduflow.com
                    </div>
                  </div>
                  {subdomainError && (
                    <p className="text-red-400 text-sm mt-2">{subdomainError}</p>
                  )}
                </div>
                
                <button 
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700"
                  onClick={() => {
                    const randomName = Math.random().toString(36).substring(2, 7);
                    setSubdomain(randomName);
                    setSubdomainError('');
                  }}
                >
                  Generate
                </button>
              </div>
              
              <div className="mt-4 bg-blue-500/10 border border-blue-500 rounded-lg p-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-300">
                    Your dashboard will be accessible at: {subdomain ? `https://${subdomain}.eduflow.com` : 'your-subdomain.eduflow.com'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-24 bg-gradient-to-br  from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <div>
                    <div className="font-medium">Student Management Template</div>
                    <div className="text-sm text-gray-400">Lifetime access</div>
                  </div>
                  <div className="font-bold">$100.00</div>
                </div>
                
                {selectedSmsPackage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex justify-between items-center pb-4 border-b border-gray-700"
                  >
                    <div>
                      <div className="font-medium">
                        {smsPackages.find(p => p.id === selectedSmsPackage).name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {smsPackages.find(p => p.id === selectedSmsPackage).volume}
                      </div>
                    </div>
                    <div className="font-bold">
                      ${smsPackages.find(p => p.id === selectedSmsPackage).price}
                    </div>
                  </motion.div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-gray-400">Subdomain</div>
                  <div className="font-mono">
                    {subdomain || 'your-subdomain'}.eduflow.com
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-700 mb-6">
                <div className="text-lg font-bold">Total</div>
                <div className="text-2xl font-bold">${calculateTotal().toFixed(2)}</div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg ${
                  isProcessing 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                }`}
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Payment...
                  </div>
                ) : (
                  'Complete Purchase'
                )}
              </motion.button>
              
              <div className="mt-6 text-center text-sm text-gray-400">
                <div className="flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure payment with 256-bit encryption
                </div>
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 13.047 14.01c-.04.3-.25.547-.546.59l-4.157.59a1 1 0 01-1.183-1.183l.59-4.157a.999.999 0 01.59-.547L12.8 5.854 12.256 4a1 1 0 01.744-.967z" clipRule="evenodd" />
                  </svg>
                  14-day money-back guarantee
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Order Complete Modal */}
      <AnimatePresence>
        {orderComplete && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Order Complete!</h2>
                <p className="text-gray-300 mb-6">
                  Thank you for your purchase. Your student management system is being set up.
                </p>
                
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
                  <div className="font-bold mb-2">Your Dashboard:</div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="font-mono">https://{subdomain}.eduflow.com</span>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6">
                  Setup instructions and login credentials have been sent to your email.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg"
                  onClick={() => window.location.href = `https://${subdomain}.eduflow.com`}
                >
                  Go to Your Dashboard
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CheckoutPage;