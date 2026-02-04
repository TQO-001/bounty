"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function addJob(data: { 
  company: string; 
  position: string; 
  status: string; 
  dateApplied: string 
}) {
  try {
    await prisma.job.create({
      data: {
        company: data.company,
        position: data.position,
        status: data.status,
        dateApplied: data.dateApplied,
        notes: "", // Default empty notes to avoid null issues
      },
    });
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to save application" };
  }
}

export async function getJobs() {
  try {
    return await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export async function deleteJob(id: number) {
  try {
    await prisma.job.delete({
      where: { id }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function updateJob(id: number, data: {
  company?: string;
  position?: string;
  status?: string;
  notes?: string;
}) {
  try {
    await prisma.job.update({
      where: { id },
      data
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}