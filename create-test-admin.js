// Create a test admin account with known password
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createTestAdmin = async () => {
  try {
    console.log('🔧 Creating test admin account...');
    
    const testPhone = '01977330749'; // Different phone number
    const testPassword = 'test123456'; // Known password
    const testName = 'Test Admin';
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { phone: testPhone }
    });
    
    if (existingAdmin) {
      console.log('⚠️ Admin with this phone already exists, updating password...');
      
      // Hash the test password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
      
      // Update the existing admin
      const updatedAdmin = await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          status: 'active',
          otp: null,
          otpExpire: null
        }
      });
      
      console.log('✅ Test admin updated successfully!');
      console.log('📱 Phone:', updatedAdmin.phone);
      console.log('👤 Name:', updatedAdmin.name);
      console.log('🔒 Status:', updatedAdmin.status);
      console.log('🔑 Test password:', testPassword);
      
    } else {
      // Hash the test password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
      
      // Create new test admin
      const newAdmin = await prisma.admin.create({
        data: {
          name: testName,
          phone: testPhone,
          password: hashedPassword,
          smsActivation: false,
          smsAmount: 0,
          status: 'active' // Set to active directly for testing
        }
      });
      
      console.log('✅ Test admin created successfully!');
      console.log('📱 Phone:', newAdmin.phone);
      console.log('👤 Name:', newAdmin.name);
      console.log('🔒 Status:', newAdmin.status);
      console.log('🔑 Test password:', testPassword);
    }
    
  } catch (error) {
    console.error('❌ Error creating test admin:', error);
  } finally {
    await prisma.$disconnect();
  }
};

createTestAdmin();
