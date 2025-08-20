const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('Creating super admin user...');

    // Check if super admin already exists
    const existingSuperAdmin = await prisma.superAdmin.findFirst({
      where: { username: 'superadmin' }
    });

    if (existingSuperAdmin) {
      console.log('Super admin already exists!');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('superadmin123', 12);

    // Create super admin
    const superAdmin = await prisma.superAdmin.create({
      data: {
        username: 'superadmin',
        email: 'superadmin@eduflow.com',
        password: hashedPassword,
        name: 'Super Administrator',
        role: 'super_admin',
        status: 'active'
      }
    });

    console.log('Super admin created successfully!');
    console.log('Username: superadmin');
    console.log('Password: superadmin123');
    console.log('Email: superadmin@eduflow.com');

  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
