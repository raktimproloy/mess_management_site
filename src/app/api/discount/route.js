import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '../../../lib/auth';

const prisma = new PrismaClient();

// GET: List all discounts (admin only, filtered by owner_id)
export async function GET(request) {
  try {
    // Verify admin authentication - required for all operations
    const authResult = verifyAdminAuth(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Admin authentication required'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const ownerId = authResult.user.owner_id || authResult.user.id;
    
    // Always filter by owner_id to ensure data isolation
    const discounts = await prisma.discount.findMany({
      where: { ownerId: ownerId },
      orderBy: { createdAt: 'desc' }
    });

    return new Response(JSON.stringify({
      success: true,
      discounts: discounts
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error fetching discounts:', error);
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

// POST: Add new discount (admin only)
export async function POST(request) {
  try {
    const authResult = verifyAdminAuth(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({ success: false, error: authResult.error }), { status: 401 });
    }
    
    const ownerId = authResult.user.owner_id || authResult.user.id;
    const { title, discountType, discountAmount, description, status } = await request.json();
    if (!title || !discountType || discountAmount === undefined) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
    }
    const discount = await prisma.discount.create({
      data: {
        title,
        discountType,
        discountAmount: parseFloat(discountAmount),
        description: description || '',
        status: status !== undefined ? parseInt(status) : 1,
        ownerId: ownerId
      }
    });
    return new Response(JSON.stringify({ success: true, discount }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

// PUT: Edit discount (admin only)
export async function PUT(request) {
  try {
    const authResult = verifyAdminAuth(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({ success: false, error: authResult.error }), { status: 401 });
    }
    
    const ownerId = authResult.user.owner_id || authResult.user.id;
    const { id, title, discountType, discountAmount, description, status } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Discount ID required' }), { status: 400 });
    }
    
    // Ensure discount belongs to the authenticated admin
    const existingDiscount = await prisma.discount.findFirst({
      where: { 
        id: parseInt(id),
        ownerId: ownerId
      }
    });
    
    if (!existingDiscount) {
      return new Response(JSON.stringify({ success: false, error: 'Discount not found or access denied' }), { status: 404 });
    }
    
    const discount = await prisma.discount.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(discountType !== undefined && { discountType }),
        ...(discountAmount !== undefined && { discountAmount: parseFloat(discountAmount) }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status: parseInt(status) })
      }
    });
    return new Response(JSON.stringify({ success: true, discount }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

// DELETE: Delete discount (admin only)
export async function DELETE(request) {
  try {
    const authResult = verifyAdminAuth(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({ success: false, error: authResult.error }), { status: 401 });
    }
    
    const ownerId = authResult.user.owner_id || authResult.user.id;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: 'Discount ID required' }), { status: 400 });
    }
    
    // Ensure discount belongs to the authenticated admin
    const existingDiscount = await prisma.discount.findFirst({
      where: { 
        id: parseInt(id),
        ownerId: ownerId
      }
    });
    
    if (!existingDiscount) {
      return new Response(JSON.stringify({ success: false, error: 'Discount not found or access denied' }), { status: 404 });
    }
    
    await prisma.discount.delete({ where: { id: parseInt(id) } });
    return new Response(JSON.stringify({ success: true, message: 'Discount deleted' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
} 