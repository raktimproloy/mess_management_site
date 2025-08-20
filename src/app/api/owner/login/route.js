import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { phone, password } = await request.json();

    // Validate required fields
    if (!phone || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Phone and password are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Find admin by phone
    const admin = await prisma.admin.findUnique({
      where: {
        phone: phone
      }
    });

    if (!admin) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid phone number or password'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if account is active
    if (admin.status !== 'active') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Account is not active. Please verify your phone number first.'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid phone number or password'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Generate JWT token
    const token = createToken({
      id: admin.id,
      name: admin.name,
      phone: admin.phone,
      type: 'admin'
    });

    // Update last login time
    await prisma.admin.update({
      where: { id: admin.id },
      data: { updatedAt: new Date() }
    });

    // Return success response with token
    const { password: _, otp: __, otpExpire: ___, ...adminWithoutSensitive } = admin;

    return new Response(JSON.stringify({
      success: true,
      message: 'Login successful',
      admin: adminWithoutSensitive,
      token: token
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}` // 7 days
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 