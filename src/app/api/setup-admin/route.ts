import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const setupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    // Check if any SYSTEM_ADMIN already exists
    const existingAdminCount = await prisma.user.count({
      where: { role: 'SYSTEM_ADMIN' },
    });

    if (existingAdminCount > 0) {
      return NextResponse.json(
        { error: 'Setup already completed. An admin user exists.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = setupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'SYSTEM_ADMIN',
        name: 'Super Admin',
      },
    });

    return NextResponse.json({
      message: 'Initial admin created successfully. You can now log in.',
      user: { id: newAdmin.id, email: newAdmin.email },
    });
  } catch (error) {
    console.error('Setup Admin Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
