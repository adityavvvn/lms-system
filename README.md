# LMS System

A full-featured Learning Management System built with Next.js, MongoDB, and NextAuth.js.

## Project Structure

```
lms-system/
├── frontend/                 # Frontend application
│   ├── app/                 # Next.js app directory
│   │   ├── (auth)/         # Authentication pages
│   │   ├── (dashboard)/    # Dashboard pages
│   │   │   ├── admin/     # Admin dashboard
│   │   │   └── student/   # Student dashboard
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # Basic UI components
│   │   │   └── forms/    # Form components
│   │   └── lib/          # Frontend utilities
│   │       ├── hooks/    # Custom React hooks
│   │       └── utils/    # Helper functions
│   └── public/           # Static assets
│
├── backend/                # Backend application
│   ├── api/              # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── courses/     # Course management endpoints
│   │   ├── categories/  # Category management endpoints
│   │   └── chapters/    # Chapter management endpoints
│   ├── models/          # Mongoose models
│   ├── lib/             # Backend utilities
│   │   ├── db.js       # Database connection
│   │   └── auth.js     # Authentication configuration
│   └── middleware/      # Custom middleware
│
├── shared/               # Shared code between frontend and backend
│   ├── constants/       # Shared constants
│   ├── types/          # Shared TypeScript types
│   └── utils/          # Shared utility functions
│
└── config/              # Configuration files
    ├── next.config.mjs
    ├── postcss.config.mjs
    └── tailwind.config.js
```

## Features

- 🔐 Authentication with NextAuth.js (Credentials + Google)
- 👥 Role-based access (Admin/Student)
- 📚 Course management
- 🎥 YouTube video integration
- 📊 Progress tracking
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS
- Radix UI Components
- React Hooks
- Custom UI Components

### Backend
- Next.js API Routes
- MongoDB with Mongoose
- NextAuth.js
- Custom Middleware

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/adityavvvn/lms-system.git
cd lms-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/lms-system

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Start MongoDB:
Make sure MongoDB is running on your system.

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Guidelines

### Frontend Development
- Place all UI components in `frontend/app/components`
- Use the `(dashboard)` directory for role-specific pages
- Keep reusable hooks in `frontend/app/lib/hooks`
- Use shared types from `shared/types`

### Backend Development
- All API routes go in `backend/api`
- Database models in `backend/models`
- Shared utilities in `backend/lib`
- Custom middleware in `backend/middleware`

### Shared Code
- Use the `shared` directory for code used by both frontend and backend
- Keep constants in `shared/constants`
- Define shared types in `shared/types`
- Place utility functions in `shared/utils`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
