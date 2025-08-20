import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '../../../lib/auth';

const prisma = new PrismaClient();

// GET - List categories (admin only, filtered by owner_id)
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
    const categories = await prisma.category.findMany({
      where: { ownerId: ownerId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return new Response(JSON.stringify({
      success: true,
      categories: categories
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
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

// POST - Create new category (admin only)
export async function POST(request) {
  try {
    // Verify admin authentication
    const authResult = verifyAdminAuth(request);
    if (!authResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: authResult.error
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const ownerId = authResult.user.owner_id || authResult.user.id;
    const { title, rentAmount, externalAmount, description, status } = await request.json();

    // Validate required fields
    if (!title || !rentAmount || !description) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Title, rent amount, and description are required'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if category with this title already exists for this owner
    const existingCategory = await prisma.category.findFirst({
      where: {
        title: title,
        ownerId: ownerId
      }
    });

    if (existingCategory) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Category with this title already exists'
      }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Create new category with owner_id
    const newCategory = await prisma.category.create({
      data: {
        title: title,
        rentAmount: parseFloat(rentAmount),
        externalAmount: externalAmount ? parseFloat(externalAmount) : 0,
        description: description,
        status: status ? parseInt(status) : 1,
        ownerId: ownerId
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error creating category:', error);
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