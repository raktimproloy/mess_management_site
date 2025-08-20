import { NextResponse } from 'next/server';
import { requireSuperAdminAuth } from '@/lib/superAdminAuth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET - List owners with filtering, search, and pagination
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
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    
    // Search and filter parameters
    const search = searchParams.get('search') || '';
    const name = searchParams.get('name') || '';
    const phone = searchParams.get('phone') || '';
    const subdomain = searchParams.get('subdomain') || '';
    const status = searchParams.get('status') || '';
    const smsActivation = searchParams.get('smsActivation') || '';
    
    // Build where clause for filtering
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { subdomain: { contains: search } }
      ];
    }
    
    if (name) {
      where.name = { contains: name };
    }
    
    if (phone) {
      where.phone = { contains: phone };
    }
    
    if (subdomain) {
      where.subdomain = { contains: subdomain };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (smsActivation !== '') {
      where.smsActivation = smsActivation === 'true';
    }

    // Get total count for pagination
    const totalCount = await prisma.admin.count({ where });
    
    // Get owners with pagination and related data
    const owners = await prisma.admin.findMany({
      where,
      include: {
        _count: {
          select: {
            students: true,
            categories: true,
            rents: true,
            complaints: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ],
      skip: offset,
      take: limit
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: owners,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    });

  } catch (error) {
    console.error('Owners API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create new owner
export async function POST(request) {
  try {
    // Validate super admin authentication
    const authResult = await requireSuperAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message },
        { status: authResult.status }
      );
    }

    const body = await request.json();
    const {
      name,
      phone,
      password,
      subdomain,
      smsActivation,
      smsAmount
    } = body;

    // Validate required fields
    if (!name || !phone || !password) {
      return NextResponse.json(
        { message: 'Name, phone, and password are required' },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingOwner = await prisma.admin.findUnique({
      where: { phone }
    });

    if (existingOwner) {
      return NextResponse.json(
        { message: 'Owner with this phone number already exists' },
        { status: 409 }
      );
    }

    // Check if subdomain already exists (if provided)
    if (subdomain) {
      const existingSubdomain = await prisma.admin.findUnique({
        where: { subdomain }
      });

      if (existingSubdomain) {
        return NextResponse.json(
          { message: 'Subdomain already exists' },
          { status: 409 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create owner
    const owner = await prisma.admin.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        subdomain: subdomain || null,
        smsActivation: smsActivation || false,
        smsAmount: smsAmount || 0,
        status: 'active'
      },
      select: {
        id: true,
        name: true,
        phone: true,
        subdomain: true,
        smsActivation: true,
        smsAmount: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Owner created successfully',
      data: owner
    }, { status: 201 });

  } catch (error) {
    console.error('Create owner error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
