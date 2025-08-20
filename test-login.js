// Test script for login API
const testLogin = async (phone, password) => {
  try {
    console.log(`🧪 Testing Login API with phone: ${phone}, password: ${password}`);
    
    const loginData = {
      phone: phone,
      password: password
    };
    
    const response = await fetch('http://localhost:3000/api/owner/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('🔑 Token:', data.token);
      console.log('👤 Admin data:', data.admin);
      return true;
    } else {
      console.log('❌ Login failed:', data.error);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
    return false;
  }
};

// Test with the test admin account
const testTestAdmin = async () => {
  console.log('🧪 Testing with test admin account...');
  
  const success = await testLogin('01977330749', 'test123456');
  
  if (success) {
    console.log('🎉 Test admin login successful!');
  } else {
    console.log('❌ Test admin login failed!');
  }
};

// Run the test
testTestAdmin();
