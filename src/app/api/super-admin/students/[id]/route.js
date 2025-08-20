import { NextResponse } from 'next/server';
import { requireSuperAdminAuth } from '@/lib/superAdminAuth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get student by ID
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
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json(
        { message: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true,
            subdomain: true,
            smsActivation: true,
            smsAmount: true
          }
        },
        categoryRef: {
          select: {
            id: true,
            title: true,
            rentAmount: true,
            externalAmount: true,
            description: true
          }
        },
        discountRef: {
          select: {
            id: true,
            title: true,
            discountAmount: true
          }
        },
        rents: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            rentAmount: true,
            status: true,
            createdAt: true
          }
        },
        rentHistory: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            rentMonth: true,
            status: true,
            paidDate: true,
            dueRent: true,
            paidRent: true
          }
        }
      }
    });

    if (!student) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Get student error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update student
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
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json(
        { message: 'Invalid student ID' },
        { status: 400 }
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

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!existingStudent) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if new phone number conflicts with other students
    if (phone && phone !== existingStudent.phone) {
      const phoneConflict = await prisma.student.findUnique({
        where: { phone }
      });

      if (phoneConflict) {
        return NextResponse.json(
          { message: 'Phone number already exists' },
          { status: 409 }
        );
      }
    }

    // Validate owner if changing
    if (ownerId && ownerId !== existingStudent.ownerId) {
      const owner = await prisma.admin.findUnique({
        where: { id: ownerId }
      });

      if (!owner) {
        return NextResponse.json(
          { message: 'Owner not found' },
          { status: 404 }
        );
      }
    }

    // Validate category if changing
    if (categoryId && categoryId !== existingStudent.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return NextResponse.json(
          { message: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // Update student
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(smsPhone && { smsPhone }),
        ...(password && { password }), // Note: In production, hash this password
        ...(profileImage !== undefined && { profileImage }),
        ...(hideRanking !== undefined && { hideRanking: hideRanking ? 1 : 0 }),
        ...(status && { status }),
        ...(categoryId && { categoryId }),
        ...(referenceId !== undefined && { referenceId: referenceId === '' ? null : referenceId }),
        ...(discountId !== undefined && { discountId: discountId === '' ? null : discountId }),
        ...(discountAmount !== undefined && { discountAmount: parseFloat(discountAmount) || 0 }),
        ...(bookingAmount !== undefined && { bookingAmount: parseFloat(bookingAmount) || 0 }),
        ...(joiningDate && { joiningDate: new Date(joiningDate) }),
        ...(ownerId && { ownerId })
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
      message: 'Student updated successfully',
      data: updatedStudent
    });

  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete student
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
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json(
        { message: 'Invalid student ID' },
        { status: 400 }
      );
    }

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!existingStudent) {
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      );
    }

    // Check if student has related data (rents, payments, etc.)
    const relatedData = await prisma.$transaction([
      prisma.rent.count({ where: { studentId } }),
      prisma.rentHistory.count({ where: { studentId } }),
      prisma.paymentRequest.count({ where: { studentId } }),
      prisma.complaint.count({ where: { studentId } })
    ]);

    const [rents, rentHistory, paymentRequests, complaints] = relatedData;
    const totalRelated = rents + rentHistory + paymentRequests + complaints;

    if (totalRelated > 0) {
      return NextResponse.json(
        { 
          message: 'Cannot delete student with related data',
          relatedData: {
            rents,
            rentHistory,
            paymentRequests,
            complaints
          }
        },
        { status: 409 }
      );
    }

    // Delete student
    await prisma.student.delete({
      where: { id: studentId }
    });

    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully'
    });

  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
