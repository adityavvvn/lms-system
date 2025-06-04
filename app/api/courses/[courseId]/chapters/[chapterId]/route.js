import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import Chapter from '@/models/Chapter';

// GET /api/courses/[courseId]/chapters/[chapterId] - Get a single chapter
export async function GET(req, { params }) {
  try {
    const { courseId, chapterId } = params;
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

    const chapter = await Chapter.findOne({
      _id: chapterId,
      course: courseId
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(chapter);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching chapter' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId]/chapters/[chapterId] - Update a chapter (admin only)
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId, chapterId } = params;
    const updates = await req.json();

    await connectDB();

    const chapter = await Chapter.findOne({
      _id: chapterId,
      course: courseId
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Only allow updating specific fields
    const allowedUpdates = ['title', 'description', 'videoUrl', 'isPublished', 'order'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    Object.assign(chapter, filteredUpdates);
    await chapter.save();

    return NextResponse.json(chapter);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Error updating chapter' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId]/chapters/[chapterId] - Delete a chapter (admin only)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId, chapterId } = params;
    await connectDB();

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const chapter = await Chapter.findOne({
      _id: chapterId,
      course: courseId
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Remove chapter from course's chapters array
    course.chapters = course.chapters.filter(
      ch => ch.toString() !== chapterId
    );
    await course.save();

    // Delete the chapter
    await chapter.deleteOne();

    return NextResponse.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting chapter' },
      { status: 500 }
    );
  }
} 