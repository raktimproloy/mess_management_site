import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function validateSuperAdminToken(token) {
  try {
    if (!token) {
      return { isValid: false, message: 'No token provided' };
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if token is for super admin
    if (decoded.type !== 'super_admin') {
      return { isValid: false, message: 'Invalid token type' };
    }

    // Check if super admin still exists and is active
    const superAdmin = await prisma.superAdmin.findUnique({
      where: { id: decoded.id }
    });

    if (!superAdmin) {
      return { isValid: false, message: 'Super admin not found' };
    }

    if (superAdmin.status !== 'active') {
      return { isValid: false, message: 'Super admin account is not active' };
    }

    return { 
      isValid: true, 
      user: {
        id: superAdmin.id,
        username: superAdmin.username,
        email: superAdmin.email,
        name: superAdmin.name,
        role: superAdmin.role
      }
    };

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { isValid: false, message: 'Token expired' };
    } else if (error.name === 'JsonWebTokenError') {
      return { isValid: false, message: 'Invalid token' };
    } else {
      console.error('Token validation error:', error);
      return { isValid: false, message: 'Token validation failed' };
    }
  } finally {
    await prisma.$disconnect();
  }
}

export function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function requireSuperAdminAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return { 
        success: false, 
        status: 401, 
        message: 'Authorization header required' 
      };
    }

    const validation = await validateSuperAdminToken(token);
    
    if (!validation.isValid) {
      return { 
        success: false, 
        status: 401, 
        message: validation.message 
      };
    }

    return { 
      success: true, 
      user: validation.user 
    };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return { 
      success: false, 
      status: 500, 
      message: 'Internal server error' 
    };
  }
}
