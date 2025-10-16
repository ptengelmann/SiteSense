import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  vatNumber: z.string().optional(),
  companyNumber: z.string().optional(),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const company = await db.company.findUnique({
      where: { id: session.user.companyId },
      select: {
        name: true,
        vatNumber: true,
        companyNumber: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        postcode: true,
        phone: true,
        email: true,
      },
    });

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: company });
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = companySchema.parse(body);

    const company = await db.company.update({
      where: { id: session.user.companyId },
      data: {
        name: validatedData.name,
        vatNumber: validatedData.vatNumber || null,
        companyNumber: validatedData.companyNumber || null,
        addressLine1: validatedData.addressLine1 || null,
        addressLine2: validatedData.addressLine2 || null,
        city: validatedData.city || null,
        postcode: validatedData.postcode || null,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Company settings updated successfully',
      data: company,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error updating company settings:', error);
    return NextResponse.json(
      { error: 'Failed to update company settings' },
      { status: 500 }
    );
  }
}
