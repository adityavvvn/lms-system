import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import SubCategory from '@/models/SubCategory';

// GET /api/categories/[categoryId]/subcategories - Get all subcategories for a category
export async function GET(req, { params }) {
  try {
    const { categoryId } = params;
    await connectDB();
    
    const subcategories = await SubCategory.find({ category: categoryId });
    return NextResponse.json(subcategories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching subcategories' },
      { status: 500 }
    );
  }
}

// POST /api/categories/[categoryId]/subcategories - Create a new subcategory (admin only)
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { categoryId } = params;
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Create subcategory
    const subcategory = await SubCategory.create({
      title,
      description,
      category: categoryId,
      slug: title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
    });

    // Add subcategory to category's subcategories array
    category.subcategories.push(subcategory._id);
    await category.save();

    return NextResponse.json(subcategory, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Subcategory with this title already exists in this category' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error creating subcategory' },
      { status: 500 }
    );
  }
} 