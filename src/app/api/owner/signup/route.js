import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { sendSMS } from '@/lib/sms';

const prisma = new PrismaClient();

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { name, phone, password } = await request.json();

    // Validate required fields
    if (!name || !phone || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Name, phone, and password are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Password must be at least 8 characters long'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if admin with this phone already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        phone: phone
      }
    });

    if (existingAdmin) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Admin with this phone number already exists'
      }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP and set expiration (15 minutes from now)
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create new admin with all the new fields
    const newAdmin = await prisma.admin.create({
      data: {
        name: name,
        phone: phone,
        password: hashedPassword,
        smsActivation: false,
        smsAmount: 0,
        otp: otp,
        otpExpire: otpExpire,
        status: 'pending'
      }
    });

    // Send SMS with OTP using your existing SMS API
    const otpMessage = `🔐 Your EduFlow verification code is: ${otp}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this message.`;
    
    const smsResult = await sendSMS(phone, otpMessage);
    
    if (!smsResult.success) {
      console.error('SMS sending failed:', smsResult.message);
      // Even if SMS fails, we'll still create the account and log the OTP
      console.log(`OTP for ${phone}: ${otp}`);
    }

    // Return success response (without password and OTP)
    const { password: _, otp: __, ...adminWithoutSensitive } = newAdmin;

    return new Response(JSON.stringify({
      success: true,
      message: 'Admin created successfully. Please verify your phone number with the OTP sent to your phone.',
      admin: adminWithoutSensitive,
      requiresOTP: true,
      smsSent: smsResult.success
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error creating admin:', error);
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
