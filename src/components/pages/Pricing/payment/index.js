"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const PaymentPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    transactionId: '',
    pin: ''
  });

  // Check authentication on component mount
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const orderDetails = {
    template: "Student Management Template",
    price: 100,
    smsPackage: "Unlimited SMS",
    smsPrice: 30,
    subdomain: "yourschool.eduflow.com",
    total: 130
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
    }, 2000);
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
    <div className="min-h-screen py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>Payment | EduFlow - Student Management Solutions</title>
        <meta name="description" content="Complete your payment for our student management solution" />
      </Head>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Methods */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 mb-8"
            >
              <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-4 px-2 rounded-xl border ${
                    paymentMethod === 'bkash' 
                      ? 'border-green-500 ring-2 ring-green-500' 
                      : 'border-gray-700 hover:border-gray-600'
                  } flex flex-col items-center`}
                  onClick={() => setPaymentMethod('bkash')}
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <div className="text-2xl text-green-800 font-bold">b</div>
                  </div>
                  <span className="font-medium">bKash</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-4 px-2 rounded-xl border ${
                    paymentMethod === 'nagad' 
                      ? 'border-purple-500 ring-2 ring-purple-500' 
                      : 'border-gray-700 hover:border-gray-600'
                  } flex flex-col items-center`}
                  onClick={() => setPaymentMethod('nagad')}
                >
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                    <div className="text-2xl text-purple-800 font-bold">N</div>
                  </div>
                  <span className="font-medium">Nagad</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-4 px-2 rounded-xl border ${
                    paymentMethod === 'rocket' 
                      ? 'border-blue-500 ring-2 ring-blue-500' 
                      : 'border-gray-700 hover:border-gray-600'
                  } flex flex-col items-center`}
                  onClick={() => setPaymentMethod('rocket')}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <div className="text-2xl text-blue-800 font-bold">R</div>
                  </div>
                  <span className="font-medium">Rocket</span>
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {paymentMethod === 'bkash' && 'bKash Phone Number'}
                      {paymentMethod === 'nagad' && 'Nagad Phone Number'}
                      {paymentMethod === 'rocket' && 'Rocket Phone Number'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">Transaction ID</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter transaction ID"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 mb-2">
                      {paymentMethod === 'bkash' && 'bKash PIN'}
                      {paymentMethod === 'nagad' && 'Nagad PIN'}
                      {paymentMethod === 'rocket' && 'Rocket PIN'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="pin"
                        value={formData.pin}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg ${
                        isProcessing 
                          ? 'bg-gray-700 cursor-not-allowed' 
                          : paymentMethod === 'bkash' 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                            : paymentMethod === 'nagad'
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                      }`}
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
                        `Pay with ${paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Rocket'}`
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
              
              <div className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-gray-700 rounded-xl p-4">
                <h3 className="font-bold mb-3">Payment Instructions</h3>
                <ul className="text-sm space-y-2">
                  {paymentMethod === 'bkash' && (
                    <>
                      <li>1. Dial *247# on your bKash registered mobile number</li>
                      <li>2. Select "Payment" option</li>
                      <li>3. Enter Merchant ID: <span className="font-mono">EDUFLOW123</span></li>
                      <li>4. Enter Amount: <span className="font-bold">৳{orderDetails.total * 100}</span></li>
                      <li>5. Enter your PIN to confirm</li>
                    </>
                  )}
                  {paymentMethod === 'nagad' && (
                    <>
                      <li>1. Dial *167# on your Nagad registered mobile number</li>
                      <li>2. Select "Payment" option</li>
                      <li>3. Enter Merchant ID: <span className="font-mono">EDUFLOW456</span></li>
                      <li>4. Enter Amount: <span className="font-bold">৳{orderDetails.total * 100}</span></li>
                      <li>5. Enter your PIN to confirm</li>
                    </>
                  )}
                  {paymentMethod === 'rocket' && (
                    <>
                      <li>1. Dial *322# on your Rocket registered mobile number</li>
                      <li>2. Select "Payment" option</li>
                      <li>3. Enter Merchant ID: <span className="font-mono">EDUFLOW789</span></li>
                      <li>4. Enter Amount: <span className="font-bold">৳{orderDetails.total * 100}</span></li>
                      <li>5. Enter your PIN to confirm</li>
                    </>
                  )}
                </ul>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6"
            >
              <h2 className="text-xl font-bold mb-4">Security Tips</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Never share your PIN with anyone</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Verify the merchant ID before payment</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Double-check the amount before confirming</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Save the transaction ID for future reference</span>
                </li>
              </ul>
            </motion.div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6"
            >
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <div>
                    <div className="font-medium">{orderDetails.template}</div>
                    <div className="text-sm text-gray-400">Lifetime access</div>
                  </div>
                  <div className="font-bold">৳{orderDetails.price * 100}</div>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-700">
                  <div>
                    <div className="font-medium">{orderDetails.smsPackage}</div>
                    <div className="text-sm text-gray-400">Monthly subscription</div>
                  </div>
                  <div className="font-bold">৳{orderDetails.smsPrice * 100}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-gray-400">Subdomain</div>
                  <div className="font-mono text-sm">
                    {orderDetails.subdomain}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-700 mb-6">
                <div className="text-lg font-bold">Total</div>
                <div className="text-2xl font-bold">৳{orderDetails.total * 100}</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-gray-700 rounded-xl p-4 mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 13.047 14.01c-.04.3-.25.547-.546.59l-4.157.59a1 1 0 01-1.183-1.183l.59-4.157a.999.999 0 01.59-.547L12.8 5.854 12.256 4a1 1 0 01.744-.967z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-400">You're saving ৳2000 with our lifetime offer!</span>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-400">
                <div className="flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure payment with SSL encryption
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

      {/* Payment Complete Modal */}
      <AnimatePresence>
        {paymentComplete && (
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
                
                <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
                <p className="text-gray-300 mb-6">
                  Thank you for your purchase. Your student management system is now active.
                </p>
                
                <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-left">
                  <div className="font-bold mb-2">Transaction Details:</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-400">Transaction ID:</div>
                    <div className="font-mono">{formData.transactionId || 'TRX-EDU-123456'}</div>
                    
                    <div className="text-gray-400">Amount:</div>
                    <div className="font-bold">৳{orderDetails.total * 100}</div>
                    
                    <div className="text-gray-400">Method:</div>
                    <div className="capitalize">{paymentMethod}</div>
                    
                    <div className="text-gray-400">Date:</div>
                    <div>{new Date().toLocaleDateString()}</div>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6">
                  Setup instructions and login credentials have been sent to your email.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg"
                    onClick={() => window.location.href = `https://${orderDetails.subdomain}`}
                  >
                    Go to Dashboard
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 px-4 bg-gray-700 text-white font-medium rounded-lg"
                    onClick={() => setPaymentComplete(false)}
                  >
                    Print Receipt
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentPage;