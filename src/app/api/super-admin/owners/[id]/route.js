import { NextResponse } from 'next/server';
import { requireSuperAdminAuth } from '@/lib/superAdminAuth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// GET - Get owner by ID
export async function GET(request, { params }) {
  try {
    // Validate super admin authentication
    const authResult = await requireSuperAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const ownerId = parseInt(id);

    if (isNaN(ownerId)) {
      return NextResponse.json(
        { message: 'Invalid owner ID' },
        { status: 400 }
      );
    }

    const owner = await prisma.admin.findUnique({
      where: { id: ownerId },
      include: {
        _count: {
          select: {
            students: true,
            categories: true,
            rents: true,
            complaints: true,
            discounts: true,
            payments: true
          }
        },
        students: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            name: true,
            phone: true,
            status: true,
            joiningDate: true
          }
        },
        categories: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            rentAmount: true,
            status: true
          }
        }
      }
    });

    if (!owner) {
      return NextResponse.json(
        { message: 'Owner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: owner
    });

  } catch (error) {
    console.error('Get owner error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update owner
export async function PUT(request, { params }) {
  try {
    // Validate super admin authentication
    const authResult = await requireSuperAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const ownerId = parseInt(id);

    if (isNaN(ownerId)) {
      return NextResponse.json(
        { message: 'Invalid owner ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      phone,
      password,
      subdomain,
      smsActivation,
      smsAmount,
      status
    } = body;

    // Check if owner exists
    const existingOwner = await prisma.admin.findUnique({
      where: { id: ownerId }
    });

    if (!existingOwner) {
      return NextResponse.json(
        { message: 'Owner not found' },
        { status: 404 }
      );
    }

    // Check if new phone number conflicts with other owners
    if (phone && phone !== existingOwner.phone) {
      const phoneConflict = await prisma.admin.findUnique({
        where: { phone }
      });

      if (phoneConflict) {
        return NextResponse.json(
          { message: 'Phone number already exists' },
          { status: 409 }
        );
      }
    }

    // Check if new subdomain conflicts with other owners
    if (subdomain && subdomain !== existingOwner.subdomain) {
      const subdomainConflict = await prisma.admin.findUnique({
        where: { subdomain }
      });

      if (subdomainConflict) {
        return NextResponse.json(
          { message: 'Subdomain already exists' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(subdomain !== undefined && { subdomain }),
      ...(smsActivation !== undefined && { smsActivation }),
      ...(smsAmount !== undefined && { smsAmount }),
      ...(status && { status })
    };

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update owner
    const updatedOwner = await prisma.admin.update({
      where: { id: ownerId },
      data: updateData,
      select: {
        id: true,
        name: true,
        phone: true,
        subdomain: true,
        smsActivation: true,
        smsAmount: true,
        status: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Owner updated successfully',
      data: updatedOwner
    });

  } catch (error) {
    console.error('Update owner error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete owner
export async function DELETE(request, { params }) {
  try {
    // Validate super admin authentication
    const authResult = await requireSuperAdminAuth(request);
    if (!authResult.success) {
      return NextResponse.json(
        { message: authResult.message },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const ownerId = parseInt(id);

    if (isNaN(ownerId)) {
      return NextResponse.json(
        { message: 'Invalid owner ID' },
        { status: 400 }
      );
    }

    // Check if owner exists
    const existingOwner = await prisma.admin.findUnique({
      where: { id: ownerId }
    });

    if (!existingOwner) {
      return NextResponse.json(
        { message: 'Owner not found' },
        { status: 404 }
      );
    }

    // Check if owner has related data
    const relatedData = await prisma.$transaction([
      prisma.student.count({ where: { ownerId } }),
      prisma.category.count({ where: { ownerId } }),
      prisma.rent.count({ where: { ownerId } }),
      prisma.rentHistory.count({ where: { ownerId } }),
      prisma.paymentRequest.count({ where: { ownerId } }),
      prisma.complaint.count({ where: { ownerId } }),
      prisma.discount.count({ where: { ownerId } }),
      prisma.payment.count({ where: { ownerId } })
    ]);

    const [students, categories, rents, rentHistory, paymentRequests, complaints, discounts, payments] = relatedData;
    const totalRelated = students + categories + rents + rentHistory + paymentRequests + complaints + discounts + payments;

    if (totalRelated > 0) {
      return NextResponse.json(
        { 
          message: 'Cannot delete owner with related data',
          relatedData: {
            students,
            categories,
            rents,
            rentHistory,
            paymentRequests,
            complaints,
            discounts,
            payments
          }
        },
        { status: 409 }
      );
    }

    // Delete owner
    await prisma.admin.delete({
      where: { id: ownerId }
    });

    return NextResponse.json({
      success: true,
      message: 'Owner deleted successfully'
    });

  } catch (error) {
    console.error('Delete owner error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
