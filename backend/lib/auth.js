import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from './db';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select('+password');
        
        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isMatch = await user.matchPassword(credentials.password);

        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        await connectDB();
        
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create new user if doesn't exist
          await User.create({
            name: user.name,
            email: user.email,
            password: Math.random().toString(36).slice(-8), // Random password
            role: 'student', // Default role
          });
        }
      }
      return true;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 