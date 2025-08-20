import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { phone, otp } = await request.json();

    // Validate required fields
    if (!phone || !otp) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Phone and OTP are required'
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

    // Check if OTP matches
    if (admin.otp !== otp) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid OTP'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if OTP has expired
    if (admin.otpExpire && new Date() > admin.otpExpire) {
      return new Response(JSON.stringify({
        success: false,
        error: 'OTP has expired. Please request a new one.'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Update admin status to active and clear OTP
    const updatedAdmin = await prisma.admin.update({
      where: {
        id: admin.id
      },
      data: {
        status: 'active',
        otp: null,
        otpExpire: null
      }
    });

    // Return success response
    const { password: _, otp: __, ...adminWithoutSensitive } = updatedAdmin;

    return new Response(JSON.stringify({
      success: true,
      message: 'Phone number verified successfully! Your account is now active.',
      admin: adminWithoutSensitive
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
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
