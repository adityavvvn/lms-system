import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

// GET /api/categories - Get all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().populate('subcategories');
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category (admin only)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const category = await Category.create({
      title,
      description,
      slug: title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Category with this title already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error creating category' },
      { status: 500 }
    );
  }
} 