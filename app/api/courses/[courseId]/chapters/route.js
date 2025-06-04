import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Chapter from '@/models/Chapter';

// GET /api/courses/[courseId]/chapters - Get all chapters for a course
export async function GET(req, { params }) {
  try {
    const { courseId } = params;
    const session = await getServerSession(authOptions);
    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // If course is not published, only admin can view chapters
    if (!course.isPublished && (!session || session.user.role !== 'admin')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const chapters = await Chapter.find({ course: courseId })
      .sort({ order: 1 });

    return NextResponse.json(chapters);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching chapters' },
      { status: 500 }
    );
  }
}

// POST /api/courses/[courseId]/chapters - Create a new chapter (admin only)
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = params;
    const { title, description, videoUrl } = await req.json();

    if (!title || !description || !videoUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Create chapter
    const chapter = await Chapter.create({
      title,
      description,
      videoUrl,
      course: courseId
    });

    // Add chapter to course's chapters array
    course.chapters.push(chapter._id);
    await course.save();

    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error creating chapter' },
      { status: 500 }
    );
  }
} 