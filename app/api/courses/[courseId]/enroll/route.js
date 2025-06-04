import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Course from '@/models/Course';
import User from '@/models/User';

// POST /api/courses/[courseId]/enroll - Enroll in a course
export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
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

    if (!course.isPublished) {
      return NextResponse.json(
        { error: 'Course is not published' },
        { status: 400 }
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push(courseId);
    await user.save();

    // Add user to course's enrolled students
    course.enrolledStudents.push(user._id);
    await course.save();

    return NextResponse.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error enrolling in course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId]/enroll - Unenroll from a course
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
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

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove course from user's enrolled courses
    user.enrolledCourses = user.enrolledCourses.filter(
      course => course.toString() !== courseId
    );
    await user.save();

    // Remove user from course's enrolled students
    course.enrolledStudents = course.enrolledStudents.filter(
      student => student.toString() !== user._id.toString()
    );
    await course.save();

    return NextResponse.json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error unenrolling from course' },
      { status: 500 }
    );
  }
} 