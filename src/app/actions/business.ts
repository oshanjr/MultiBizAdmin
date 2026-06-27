"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import crypto from "crypto";

export async function createBusiness(formData: FormData) {
  const session = await auth();
  
  if (!session || !["OWNER", "SYSTEM_ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const type = formData.get("type") as any;

  if (!name || !type) {
    return { error: "Name and type are required" };
  }

  // Generate a secure random API key for the business
  const rawApiKey = crypto.randomBytes(32).toString("hex");
  const apiKey = `mba_${rawApiKey}`;

  try {
    await prisma.businessModule.create({
      data: {
        name,
        type,
        apiKey, // For production, we might store a hash and only show the raw key once
        isActive: true,
      },
    });

    revalidatePath("/dashboard/businesses");
    revalidatePath("/dashboard");
    
    // Return the raw API key so it can be shown to the user once
    return { success: true, apiKey };
  } catch (error) {
    console.error("Error creating business:", error);
    return { error: "Failed to create business module" };
  }
}

export async function toggleBusinessStatus(id: string, currentStatus: boolean) {
  const session = await auth();
  
  if (!session || !["OWNER", "SYSTEM_ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.businessModule.update({
      where: { id },
      data: { isActive: !currentStatus },
    });
    revalidatePath("/dashboard/businesses");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}

export async function deleteBusiness(id: string) {
  const session = await auth();
  
  if (!session || !["OWNER", "SYSTEM_ADMIN"].includes(session.user.role)) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.businessModule.delete({
      where: { id },
    });
    revalidatePath("/dashboard/businesses");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete business" };
  }
}
