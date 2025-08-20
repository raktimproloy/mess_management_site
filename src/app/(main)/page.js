'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time for animations
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>EduFlow | Modern Student Management Solutions</title>
        <meta name="description" content="Transform your educational institution with our powerful student management platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-lighten filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Revolutionize Student Management
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                All-in-one platform to streamline enrollment, attendance, grading, and communication for educational institutions
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30">
                  Start Free Trial
                </button>
                <button className="px-8 py-4 bg-gray-800 rounded-xl font-bold text-lg border border-gray-700 hover:bg-gray-700 transition-all transform hover:scale-105">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-2 shadow-xl">
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="flex justify-between items-center px-6 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-gray-400">dashboard.eduflow.com</div>
                  <div className="w-6"></div>
                </div>
                <div className="p-6 min-h-[400px] flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg">Students</h3>
                      <div className="text-sm px-3 py-1 bg-blue-500/20 rounded-full text-blue-400">24 new</div>
                    </div>
                    <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex items-center gap-3 hover:bg-gray-700/50 p-3 rounded-lg transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg">👤</div>
                          <div>
                            <div className="font-medium">Student {i}</div>
                            <div className="text-sm text-gray-400">Grade {i+7}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="font-bold text-lg mb-4">Attendance</h3>
                      <div className="h-40 flex items-end gap-2">
                        {[80, 75, 90, 85, 88, 92, 95].map((val, i) => (
                          <div 
                            key={i}
                            className="flex-1 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-md"
                            style={{ height: `${val}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="text-center mt-4 text-sm text-gray-400">Weekly Attendance Rate: 89%</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="font-bold text-lg mb-4">Grades Overview</h3>
                      <div className="flex items-center justify-center h-40">
                        <div className="relative w-32 h-32">
                          <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
                          <div 
                            className="absolute inset-0 rounded-full border-8 border-blue-500 animate-circular-progress"
                            style={{
                              clipPath: `polygon(50% 50%, 50% 0%, ${85 * Math.cos(Math.PI / 2)}% ${85 * Math.sin(Math.PI / 2)}%, 0% 0%)`,
                              strokeDasharray: "283",
                              strokeDashoffset: "283 - (283 * 0.85)"
                            }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold">85%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Educational Leaders
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join hundreds of institutions transforming their student management processes
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '200+', label: 'Institutions' },
              { value: '1M+', label: 'Students Managed' },
              { value: '98%', label: 'Retention Rate' },
              { value: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-500 hover:-translate-y-1 ${index % 2 === 0 ? 'hover:shadow-lg hover:shadow-blue-500/20' : 'hover:shadow-lg hover:shadow-purple-500/20'}`}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/50 via-gray-800/30 to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage students effectively in one intuitive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Automated Enrollment",
                desc: "Streamline admissions with customizable workflows and document management",
                icon: "📋"
              },
              {
                title: "Attendance Tracking",
                desc: "Real-time monitoring with biometric, RFID, and mobile options",
                icon: "📱"
              },
              {
                title: "Grade Management",
                desc: "Automated grading systems with analytics and reporting",
                icon: "📊"
              },
              {
                title: "Fee Management",
                desc: "Integrated payment processing and financial reporting",
                icon: "💳"
              },
              {
                title: "Communication Hub",
                desc: "Messaging portal for staff, students, and parents",
                icon: "💬"
              },
              {
                title: "Reporting Dashboard",
                desc: "Real-time analytics and customizable reports",
                icon: "📈"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-500 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of institutions revolutionizing their student management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div 
                key={item} 
                className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-500"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 italic mb-6">
                  "Reduced administrative workload by 70% and improved parent engagement significantly. Essential for modern education."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-lg">👩‍💼</div>
                  <div className="ml-4">
                    <p className="font-bold">Sarah Johnson</p>
                    <p className="text-gray-400">Principal, City College</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-700 to-purple-800 p-1 rounded-full inline-block mb-6">
            <div className="bg-gray-900 text-blue-400 text-sm font-bold px-4 py-1 rounded-full">
              LIMITED TIME OFFER
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Institution?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Join thousands of schools and universities using EduFlow to revolutionize their student management
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30">
              Get Started - Free 30-Day Trial
            </button>
            <button className="px-8 py-4 bg-gray-800 rounded-xl font-bold text-lg border border-gray-700 hover:bg-gray-700 transition-all transform hover:scale-105">
              Schedule a Demo
            </button>
          </div>
          
          <div className="mt-8 text-gray-400 text-sm">
            No credit card required • Cancel anytime
          </div>
        </div>
      </section>
      
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        @keyframes circular-progress {
          0% { clip-path: polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%); }
          100% { clip-path: polygon(50% 50%, 50% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 0%, 85% 0%); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-circular-progress {
          animation: circular-progress 2s ease-out forwards;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}