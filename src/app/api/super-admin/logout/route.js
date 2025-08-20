import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // For JWT-based authentication, logout is handled client-side
    // by removing the token from localStorage
    // This endpoint can be used for additional server-side cleanup if needed
    
    return NextResponse.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Super admin logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
