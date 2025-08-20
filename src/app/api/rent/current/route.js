import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getMonthRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

export async function GET(request) {
  try {
    // Check if admin is authenticated to filter by owner_id
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Authorization header missing'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Verify admin authentication
    const { verifyAdminAuth } = await import('../../../../lib/auth');
    const authResult = verifyAdminAuth(request);
    
    console.log('Auth result:', authResult);
    
    if (!authResult.success) {
      console.log('Authentication failed:', authResult.error);
      return new Response(JSON.stringify({
        success: false,
        error: authResult.error || 'Admin authentication required'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Admin ID is the owner ID - check both id and owner_id fields
    const ownerId = authResult.user.owner_id || authResult.user.id;
    console.log('Owner ID:', ownerId);
    console.log('Auth user:', authResult.user);
    
    if (!ownerId) {
      console.log('No owner ID found in user data');
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid admin data'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';

    const now = new Date();
    const { start, end } = getMonthRange(now);

    // Build where clause using createdAt instead of monthYear
    const where = {
      createdAt: {
        gte: start,
        lt: end,
      },
      ownerId: ownerId, // Always filter by owner_id
      ...(category ? { categoryId: parseInt(category) } : {}),
      ...(search && {
        student: {
          OR: [
            { name: { contains: search } },
            { phone: { contains: search } },
            { smsPhone: { contains: search } },
          ],
          ownerId: ownerId // Ensure student belongs to same owner
        },
      }),
    };

    // Get rents with pagination
    const [total, rents] = await Promise.all([
      prisma.rent.count({ where }),
      prisma.rent.findMany({
        where,
        include: { 
          student: {
            select: {
              id: true,
              name: true,
              phone: true,
              smsPhone: true,
              status: true,
              categoryRef: true
            }
          }, 
          category: true 
        },
        orderBy: { id: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    // Summary for current month using createdAt
    const allRents = await prisma.rent.findMany({
      where: { 
        createdAt: { gte: start, lt: end },
        ownerId: ownerId // Always filter by owner_id
      },
    });
    
    // Handle case where no rents exist for this owner
    if (allRents.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        rents: [],
        total: 0,
        page,
        pageSize,
        summary: {
          totalStudents: 0,
          totalRent: 0,
          totalPaid: 0,
          totalDue: 0,
        },
      }), { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const totalStudents = new Set(allRents.map(r => r.studentId)).size;
    const totalRent = allRents.reduce((sum, r) => sum + (r.rentAmount + r.externalAmount + (r.previousDue || 0)), 0);
    const totalPaid = allRents.reduce((sum, r) => sum + (r.rentPaid + (r.externalPaid || 0)), 0);
    const totalDue = totalRent - totalPaid;

    return new Response(JSON.stringify({
      success: true,
      rents,
      total,
      page,
      pageSize,
      summary: {
        totalStudents,
        totalRent,
        totalPaid,
        totalDue,
      },
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error('Error fetching current rents:', err);
    return new Response(JSON.stringify({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 