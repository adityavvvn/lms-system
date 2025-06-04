import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

// GET /api/courses/[courseId] - Get a single course
export async function GET(req, { params }) {
  try {
    const { courseId } = params;
    await connectDB();

    const course = await Course.findById(courseId)
      .populate('category')
      .populate('subcategory')
      .populate('createdBy', 'name')
      .populate({
        path: 'chapters',
        options: { sort: { order: 1 } }
      });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching course' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId] - Update a course (admin only)
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = params;
    const updates = await req.json();

    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Only allow updating specific fields
    const allowedUpdates = ['title', 'description', 'category', 'subcategory', 'thumbnail', 'isPublished'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    Object.assign(course, filteredUpdates);
    await course.save();

    return NextResponse.json(course);
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Course with this title already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error updating course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId] - Delete a course (admin only)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = params;
    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    await course.deleteOne();
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting course' },
      { status: 500 }
    );
  }
} 