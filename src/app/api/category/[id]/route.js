import { PrismaClient } from '@prisma/client';
import { verifyAdminAuth } from '../../../../lib/auth';

const prisma = new PrismaClient();

// GET - Get category by ID (admin only, must own the category)
export async function GET(request, { params }) {
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

    const { id } = await params;
    const categoryId = parseInt(id);
    const ownerId = authResult.user.owner_id;

    if (isNaN(categoryId)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid category ID'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Get category and verify ownership
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        ownerId: ownerId // Ensure admin owns this category
      }
    });

    if (!category) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Category not found or access denied'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      category: category
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error fetching category:', error);
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

// PUT - Update category (admin only, must own the category)
export async function PUT(request, { params }) {
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

    const { id } = await params;
    const categoryId = parseInt(id);
    const ownerId = authResult.user.owner_id || authResult.user.id;
    const { title, rentAmount, externalAmount, description, status } = await request.json();

    if (isNaN(categoryId)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid category ID'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if category exists and admin owns it
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: categoryId,
        ownerId: ownerId // Ensure admin owns this category
      }
    });

    if (!existingCategory) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Category not found or access denied'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if title is being changed and if it conflicts with another category of the same owner
    if (title && title !== existingCategory.title) {
      const titleConflict = await prisma.category.findFirst({
        where: {
          title: title,
          ownerId: ownerId, // Only check within the same owner's categories
          id: {
            not: categoryId
          }
        }
      });

      if (titleConflict) {
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
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId
      },
      data: {
        title: title || existingCategory.title,
        rentAmount: rentAmount ? parseFloat(rentAmount) : existingCategory.rentAmount,
        externalAmount: externalAmount !== undefined ? parseFloat(externalAmount) : existingCategory.externalAmount,
        description: description || existingCategory.description,
        status: status !== undefined ? parseInt(status) : existingCategory.status
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error updating category:', error);
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

// DELETE - Delete category (admin only, must own the category)
export async function DELETE(request, { params }) {
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

    const { id } = await params;
    const categoryId = parseInt(id);
    const ownerId = authResult.user.owner_id;

    if (isNaN(categoryId)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid category ID'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if category exists and admin owns it
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: categoryId,
        ownerId: ownerId // Ensure admin owns this category
      }
    });

    if (!existingCategory) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Category not found or access denied'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Check if category is being used by students or rents of the same owner
    const studentsUsingCategory = await prisma.student.findFirst({
      where: {
        categoryId: categoryId,
        ownerId: ownerId // Only check students of the same owner
      }
    });

    const rentsUsingCategory = await prisma.rent.findFirst({
      where: {
        categoryId: categoryId,
        ownerId: ownerId // Only check rents of the same owner
      }
    });

    if (studentsUsingCategory || rentsUsingCategory) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Cannot delete category. It is being used by students or rents.'
      }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Delete category
    await prisma.category.delete({
      where: {
        id: categoryId
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Category deleted successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error deleting category:', error);
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