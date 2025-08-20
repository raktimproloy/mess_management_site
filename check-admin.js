// Check admin account in database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const checkAdmin = async () => {
  try {
    console.log('🔍 Checking admin account...');
    
    const admin = await prisma.admin.findUnique({
      where: {
        phone: '01977330748'
      }
    });
    
    if (admin) {
      console.log('✅ Admin found:');
      console.log('📱 Phone:', admin.phone);
      console.log('👤 Name:', admin.name);
      console.log('🔒 Status:', admin.status);
      console.log('📅 Created:', admin.createdAt);
      console.log('📅 Updated:', admin.updatedAt);
      console.log('🔑 Has password:', !!admin.password);
      console.log('📱 Has OTP:', !!admin.otp);
      console.log('⏰ OTP expires:', admin.otpExpire);
      console.log('📊 Full object:', JSON.stringify(admin, null, 2));
    } else {
      console.log('❌ Admin not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkAdmin();
