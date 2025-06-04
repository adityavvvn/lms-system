import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

// GET /api/courses - Get all courses
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const published = searchParams.get('published');

    await connectDB();

    const query = {};
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (published === 'true') query.isPublished = true;

    const courses = await Course.find(query)
      .populate('category')
      .populate('subcategory')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course (admin only)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, description, category, subcategory, thumbnail } = await req.json();

    if (!title || !description || !category || !subcategory) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const course = await Course.create({
      title,
      description,
      category,
      subcategory,
      thumbnail,
      createdBy: session.user.id,
      slug: title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Course with this title already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error creating course' },
      { status: 500 }
    );
  }
} 