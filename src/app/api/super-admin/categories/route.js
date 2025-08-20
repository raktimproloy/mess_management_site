import { NextResponse } from 'next/server';
import { requireSuperAdminAuth } from '@/lib/superAdminAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all categories
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

    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    
    // Build where clause
    const where = {};
    if (ownerId) {
      where.ownerId = parseInt(ownerId);
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            subdomain: true
          }
        },
        _count: {
          select: {
            students: true,
            rents: true
          }
        }
      },
      orderBy: [
        { title: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
