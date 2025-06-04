# LMS System

A full-featured Learning Management System built with Next.js, MongoDB, and NextAuth.js.

## Features

- 🔐 Authentication with NextAuth.js (Credentials + Google)
- 👥 Role-based access (Admin/Student)
- 📚 Course management
- 🎥 YouTube video integration
- 📊 Progress tracking
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd lms-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/lms-system
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Start MongoDB:
Make sure MongoDB is running on your system.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /api           → API routes
  /auth          → Authentication pages
  /admin         → Admin dashboard
  /student       → Student dashboard
/lib
  /db.js         → MongoDB connection
  /auth.js       → NextAuth configuration
/models          → Mongoose models
/middleware.js   → Route protection
```

## Features to Implement

- [x] Project setup and authentication
- [ ] Admin dashboard
- [ ] Course management
- [ ] Chapter management
- [ ] Student enrollment
- [ ] Progress tracking
- [ ] Analytics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
