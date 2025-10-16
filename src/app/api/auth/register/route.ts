import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  companyName: z.string().min(1, 'Company name is required'),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, companyName, phone } = validation.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hash(password, 10);

    // Create company and user in a transaction
    const result = await db.$transaction(async (tx) => {
      // Create company
      const company = await tx.company.create({
        data: {
          name: companyName,
          subscriptionTier: 'STARTER',
          subscriptionStatus: 'TRIAL',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        },
      });

      // Create user
      const user = await tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          passwordHash,
          phone: phone || null,
          role: 'ADMIN', // First user is always admin
          companyId: company.id,
          emailVerified: false,
          isActive: true,
        },
      });

      return { user, company };
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
