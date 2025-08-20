import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, email, password, name } = await request.json();

    // Validate input
    if (!username || !email || !password || !name) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await prisma.superAdmin.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return NextResponse.json(
        { message: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.superAdmin.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create super admin
    const superAdmin = await prisma.superAdmin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
        role: 'super_admin',
        status: 'active'
      }
    });

    // Return success response (without password)
    return NextResponse.json({
      message: 'Super admin created successfully',
      user: {
        id: superAdmin.id,
        username: superAdmin.username,
        email: superAdmin.email,
        name: superAdmin.name,
        role: superAdmin.role,
        status: superAdmin.status
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Super admin signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
