"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const createAdminSchema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["OWNER", "SYSTEM_ADMIN"]),
});

const resetPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
});

export async function createAdmin(formData: FormData) {
  const session = await auth();

  if (!session || !["OWNER", "SYSTEM_ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  const parsed = createAdminSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { name, email, password, role } = parsed.data;

  try {
    // Check if user with this email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { error: "A user with this email already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    revalidatePath("/dashboard/admins");
    return { success: true };
  } catch (error) {
    console.error("Error creating admin:", error);
    return { error: "Failed to create admin user" };
  }
}

export async function resetPassword(formData: FormData) {
  const session = await auth();

  if (!session) {
    return { error: "Unauthorized" };
  }

  const parsed = resetPasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { currentPassword, newPassword, confirmPassword } = parsed.data;

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return { error: "Current password is incorrect" };
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newPasswordHash },
    });

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: "Failed to reset password" };
  }
}

export async function deleteAdmin(id: string) {
  const session = await auth();

  if (!session || !["OWNER", "SYSTEM_ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  // Prevent deleting yourself
  if (session.user.id === id) {
    return { error: "You cannot delete your own account" };
  }

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/dashboard/admins");
    return { success: true };
  } catch (error) {
    console.error("Error deleting admin:", error);
    return { error: "Failed to delete admin user" };
  }
}
