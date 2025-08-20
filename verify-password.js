// Verify password against stored hash
const bcrypt = require('bcrypt');

const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log(`🔐 Password: "${plainPassword}" matches hash: ${isMatch ? '✅ YES' : '❌ NO'}`);
    return isMatch;
  } catch (error) {
    console.error('❌ Error comparing passwords:', error);
    return false;
  }
};

// Test with the stored hash from the database
const storedHash = '$2b$10$6pEiz5Ww70E8ZiDmMm8OHuROFev03EWgz74smiYrVLR7mlSD8di4i';

console.log('🔍 Verifying password against stored hash...');
console.log('📱 Stored hash:', storedHash);

// Test common passwords
const testPasswords = [
  'password123',
  'Password123',
  'newowner123',
  'NewOwner123',
  '12345678',
  'admin123',
  'Admin123',
  'test123',
  'Test123',
  'owner123',
  'Owner123'
];

const testAllPasswords = async () => {
  for (const password of testPasswords) {
    await verifyPassword(password, storedHash);
  }
};

testAllPasswords();
