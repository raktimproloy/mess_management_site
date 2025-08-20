'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      category: "Student Management",
      title: "Complete Student Lifecycle Tracking",
      description: "From enrollment to graduation, track every student's journey with our comprehensive management system. Automate administrative tasks and focus on what matters - education.",
      items: [
        "Automated enrollment workflows",
        "Centralized student profiles",
        "Attendance tracking with analytics",
        "Behavior and achievement logs",
        "Graduation pathway planning"
      ],
      stats: [
        { value: "95%", label: "Reduction in paperwork" },
        { value: "40h", label: "Saved per month" },
        { value: "99%", label: "Accuracy rate" }
      ]
    },
    {
      category: "Academic Tools",
      title: "Powerful Academic Management Suite",
      description: "Transform how you manage curriculum, grades, and academic performance with our advanced tools designed for educators.",
      items: [
        "Automated grade calculation",
        "Customizable report cards",
        "Learning outcome tracking",
        "Curriculum mapping",
        "Standards-based assessment"
      ],
      stats: [
        { value: "3x", label: "Faster grading" },
        { value: "92%", label: "Teacher satisfaction" },
        { value: "45%", label: "Improved insights" }
      ]
    },
    {
      category: "Communication Hub",
      title: "Seamless School-Home Connection",
      description: "Bridge the communication gap between educators, students, and parents with our integrated messaging platform.",
      items: [
        "Real-time messaging portal",
        "Automated notifications",
        "Parent engagement analytics",
        "Multi-language support",
        "Event management system"
      ],
      stats: [
        { value: "78%", label: "Parent engagement increase" },
        { value: "4.8/5", label: "User satisfaction" },
        { value: "60%", label: "Reduced missed events" }
      ]
    },
    {
      category: "Analytics",
      title: "Data-Driven Decision Making",
      description: "Unlock powerful insights with our advanced analytics dashboard designed to improve institutional performance.",
      items: [
        "Real-time performance dashboards",
        "Predictive analytics",
        "Custom report builder",
        "Attendance trend analysis",
        "Resource allocation insights"
      ],
      stats: [
        { value: "85%", label: "Faster decisions" },
        { value: "27%", label: "Cost savings" },
        { value: "92%", label: "Data accessibility" }
      ]
    }
  ];

  const currentFeature = features[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>Features | EduFlow - Student Management Solutions</title>
        <meta name="description" content="Discover powerful features that transform how educational institutions manage students, academics, and operations" />
      </Head>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-lighten filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full font-medium">
                Powerful Features
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6"
            >
              Transform Your Institution with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Smart Tools</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Discover how our comprehensive suite of features can streamline operations, enhance learning, and improve outcomes for your educational institution
            </motion.p>
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {features.map((feature, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === index
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {feature.category}
              </motion.button>
            ))}
          </div>

          {/* Feature Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-2 text-blue-400 font-medium">{currentFeature.category}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{currentFeature.title}</h2>
              <p className="text-xl text-gray-300 mb-8">{currentFeature.description}</p>
              
              <div className="space-y-4 mb-10">
                {currentFeature.items.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1.5">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="ml-4 text-lg text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-6">
                {currentFeature.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-2 shadow-xl">
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
                  
                  {/* Dynamic Dashboard Preview */}
                  <div className="p-6">
                    {activeTab === 0 && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">Student Overview</h3>
                          <div className="text-sm px-3 py-1 bg-blue-500/20 rounded-full text-blue-400">24 new</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="text-gray-400 text-sm mb-1">Total Students</div>
                            <div className="text-2xl font-bold">1,842</div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="text-gray-400 text-sm mb-1">Attendance</div>
                            <div className="text-2xl font-bold">94%</div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="text-gray-400 text-sm mb-1">New Enrollments</div>
                            <div className="text-2xl font-bold">47</div>
                          </div>
                        </div>
                        <div className="h-64 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-gray-700 p-4">
                          <div className="flex justify-between mb-4">
                            <div className="font-medium">Attendance Trend</div>
                            <div className="text-sm text-gray-400">Last 30 days</div>
                          </div>
                          <div className="h-40 flex items-end gap-1">
                            {[85, 90, 88, 92, 89, 93, 95, 94, 92, 96, 94, 93, 92, 94, 96].map((val, i) => (
                              <div 
                                key={i}
                                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-md"
                                style={{ height: `${val}%` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 1 && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">Academic Dashboard</h3>
                          <div className="text-sm px-3 py-1 bg-purple-500/20 rounded-full text-purple-400">Grading</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="flex justify-between mb-3">
                              <div className="font-medium">Class Performance</div>
                              <div className="text-sm text-green-500">+12%</div>
                            </div>
                            <div className="h-32 w-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-gray-700"></div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="font-medium mb-3">Grade Distribution</div>
                            <div className="flex items-center justify-center h-32">
                              <div className="relative w-28 h-28">
                                <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
                                <div 
                                  className="absolute inset-0 rounded-full border-8 border-purple-500 animate-circular-progress"
                                  style={{
                                    clipPath: `polygon(50% 50%, 50% 0%, ${75 * Math.cos(Math.PI / 2)}% ${75 * Math.sin(Math.PI / 2)}%, 0% 0%)`,
                                    strokeDasharray: "283",
                                    strokeDashoffset: "283 - (283 * 0.75)"
                                  }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-lg font-bold">A: 75%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-gray-700 flex items-center px-4 text-sm">
                          <span>📊</span>
                          <span className="ml-2">Grade submission for Math 101 is 85% complete</span>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 2 && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">Communication Center</h3>
                          <div className="text-sm px-3 py-1 bg-green-500/20 rounded-full text-green-400">Online</div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex flex-col items-center">
                            <div className="text-3xl mb-2">📩</div>
                            <div className="text-center">
                              <div className="font-bold">142</div>
                              <div className="text-sm text-gray-400">Messages</div>
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex flex-col items-center">
                            <div className="text-3xl mb-2">👪</div>
                            <div className="text-center">
                              <div className="font-bold">87%</div>
                              <div className="text-sm text-gray-400">Parent Reach</div>
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 flex flex-col items-center">
                            <div className="text-3xl mb-2">📅</div>
                            <div className="text-center">
                              <div className="font-bold">5</div>
                              <div className="text-sm text-gray-400">Upcoming Events</div>
                            </div>
                          </div>
                        </div>
                        <div className="h-48 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-gray-700 p-4">
                          <div className="font-medium mb-3">Recent Messages</div>
                          <div className="space-y-3">
                            {[1,2].map(i => (
                              <div key={i} className="flex items-start p-3 bg-gray-800/50 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">👤</div>
                                <div className="ml-3">
                                  <div className="font-medium">Parent Meeting Request</div>
                                  <div className="text-sm text-gray-400">From: John Smith · 2 hours ago</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 3 && (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg">Analytics Dashboard</h3>
                          <div className="text-sm px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400">Live Data</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="font-medium mb-2">Performance Trends</div>
                            <div className="h-32 w-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg border border-gray-700 flex items-center justify-center">
                              <div className="w-full h-12 flex items-end justify-around px-4">
                                {[30, 50, 70, 60, 80, 90].map((h, i) => (
                                  <div key={i} className="w-4 bg-gradient-to-t from-blue-500 to-blue-600" style={{ height: `${h}%` }}></div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="font-medium mb-2">Resource Allocation</div>
                            <div className="flex items-center justify-center h-32">
                              <div className="relative w-28 h-28">
                                <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>
                                <div 
                                  className="absolute inset-0 rounded-full border-8 border-blue-500 animate-circular-progress"
                                  style={{
                                    clipPath: `polygon(50% 50%, 50% 0%, ${65 * Math.cos(Math.PI / 2)}% ${65 * Math.sin(Math.PI / 2)}%, 0% 0%)`,
                                    strokeDasharray: "283",
                                    strokeDashoffset: "283 - (283 * 0.65)"
                                  }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-lg font-bold">65%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-gray-700 flex items-center px-4 text-sm">
                          <span>📈</span>
                          <span className="ml-2">Key Insight: Student engagement increases 40% with personalized communication</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 bg-purple-500/20 rounded-full filter blur-xl z-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <motion.div 
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-blue-500/20 rounded-full filter blur-xl z-0"
                animate={{ 
                  scale: [1, 1.3, 1],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/50 via-gray-800/30 to-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Why Institutions Choose EduFlow
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover the transformative benefits that make us the preferred choice for educational institutions
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Time Savings",
                desc: "Reduce administrative workload by up to 70% with automation",
                icon: "⏱️",
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Improved Outcomes",
                desc: "Enhance student performance with data-driven insights",
                icon: "📈",
                color: "from-purple-500 to-purple-600"
              },
              {
                title: "Cost Efficiency",
                desc: "Save up to 40% on operational costs with streamlined processes",
                icon: "💰",
                color: "from-green-500 to-green-600"
              },
              {
                title: "Enhanced Engagement",
                desc: "Boost parent and student engagement by 78% with our communication tools",
                icon: "👥",
                color: "from-yellow-500 to-yellow-600"
              },
              {
                title: "Data Security",
                desc: "Enterprise-grade security protecting your institutional data",
                icon: "🔒",
                color: "from-red-500 to-red-600"
              },
              {
                title: "Scalability",
                desc: "Grow from 50 to 50,000 students without changing systems",
                icon: "🚀",
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:shadow-lg transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  borderColor: "#6366F1"
                }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${benefit.color} flex items-center justify-center text-2xl mb-6`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-lighten filter blur-3xl"></div>
          </div>
          
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Institution?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Join thousands of schools and universities using EduFlow to revolutionize their student management
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                className="px-8 py-4 bg-gray-800 text-white font-bold rounded-xl border border-gray-700 hover:bg-gray-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Schedule a Demo
              </motion.button>
            </div>
          </motion.div>
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
};

export default FeaturesPage;