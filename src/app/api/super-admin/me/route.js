import { NextResponse } from 'next/server';
import { requireSuperAdminAuth } from '@/lib/superAdminAuth';

export async function GET(request) {
  try {
    // Validate super admin authentication
    const authResult = await requireSuperAdminAuth(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message },
        { status: authResult.status }
      );
    }

    // Return user information
    return NextResponse.json({
      message: 'Authentication successful',
      user: authResult.user
    });

  } catch (error) {
    console.error('Super admin me endpoint error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
