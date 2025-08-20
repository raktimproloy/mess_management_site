import { PrismaClient } from '@prisma/client';
import { sendSMS } from '@/lib/sms';

const prisma = new PrismaClient();

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const { phone } = await request.json();

    // Validate required fields
    if (!phone) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Phone number is required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Find the admin by phone
    const admin = await prisma.admin.findUnique({
      where: {
        phone: phone
      }
    });

    if (!admin) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Admin not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if admin is already verified
    if (admin.status === 'active') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Account is already verified'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Generate new OTP and set expiration (15 minutes from now)
    const newOtp = generateOTP();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update admin with new OTP
    await prisma.admin.update({
      where: {
        id: admin.id
      },
      data: {
        otp: newOtp,
        otpExpire: otpExpire
      }
    });

    // Send SMS with new OTP to the phone number
    const otpMessage = `🔐 Your new EduFlow verification code is: ${newOtp}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this code, please ignore this message.`;
    
    const smsResult = await sendSMS(phone, otpMessage);
    
    if (!smsResult.success) {
      console.error('SMS sending failed:', smsResult.message);
      // Even if SMS fails, we'll still log the OTP
      console.log(`New OTP for ${phone}: ${newOtp}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'New OTP sent successfully to your phone number.',
      smsSent: smsResult.success
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error resending OTP:', error);
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
