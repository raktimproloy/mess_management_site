import { NextResponse } from 'next/server';
import { requireSuperAdminAuth } from '@/lib/superAdminAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List students with filtering, search, and pagination
export async function GET(request) {
  try {
    console.log('Students API: Request received');
    console.log('Students API: Headers:', Object.fromEntries(request.headers.entries()));
    
    // Validate super admin authentication
    const authResult = await requireSuperAdminAuth(request);
    console.log('Students API: Auth result:', authResult);
    
    if (!authResult.success) {
      console.log('Students API: Authentication failed:', authResult.message);
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
    const owner = searchParams.get('owner') || '';
    const status = searchParams.get('status') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const ownerId = searchParams.get('ownerId') || '';
    
    // Build where clause for filtering
    const where = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { owner: { name: { contains: search } } }
      ];
    }
    
    if (name) {
      where.name = { contains: name };
    }
    
    if (phone) {
      where.phone = { contains: phone };
    }
    
    if (owner) {
      where.owner = { name: { contains: owner } };
    }
    
    if (status) {
      where.status = status;
    }
    
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    
    if (ownerId) {
      where.ownerId = parseInt(ownerId);
    }

    // Get total count for pagination
    const totalCount = await prisma.student.count({ where });
    
    // Get students with pagination and relations
    const students = await prisma.student.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            subdomain: true
          }
        },
        categoryRef: {
          select: {
            id: true,
            title: true,
            rentAmount: true
          }
        },
        discountRef: {
          select: {
            id: true,
            title: true,
            discountAmount: true
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
      data: students,
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
    console.error('Students API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create new student
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
      smsPhone,
      password,
      profileImage,
      hideRanking,
      status,
      categoryId,
      referenceId,
      discountId,
      discountAmount,
      bookingAmount,
      joiningDate,
      ownerId
    } = body;

    // Validate required fields
    if (!name || !phone || !smsPhone || !password || !categoryId || !ownerId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingStudent = await prisma.student.findUnique({
      where: { phone }
    });

    if (existingStudent) {
      return NextResponse.json(
        { message: 'Student with this phone number already exists' },
        { status: 409 }
      );
    }

    // Check if owner exists
    const owner = await prisma.admin.findUnique({
      where: { id: ownerId }
    });

    if (!owner) {
      return NextResponse.json(
        { message: 'Owner not found' },
        { status: 404 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        name,
        phone,
        smsPhone,
        password, // Note: In production, hash this password
        profileImage,
        hideRanking: hideRanking ? 1 : 0,
        status: status || 'living',
        categoryId,
        referenceId: referenceId || null,
        discountId: discountId || null,
        discountAmount: discountAmount || 0,
        bookingAmount: bookingAmount || 0,
        joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
        ownerId
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            subdomain: true
          }
        },
        categoryRef: {
          select: {
            id: true,
            title: true,
            rentAmount: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Student created successfully',
      data: student
    }, { status: 201 });

  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
