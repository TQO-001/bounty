"use server";

import { PrismaClient } from "@prisma/client"; // [cite: 1]
import { revalidatePath } from "next/cache";

// Prisma 7 client initialization
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Pass the DATABASE_URL to the client constructor
export const prisma = 
  globalForPrisma.prisma || 
  new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function addJob(formData: { 
  company: string; 
  position: string; 
  status: string; 
  dateApplied: string 
}) {
  await prisma.job.create({
    data: formData, // 
  });
  
  revalidatePath("/");
}

export async function getJobs() {
  return await prisma.job.findMany({
    orderBy: { createdAt: 'desc' } // 
  });
}

export async function deleteJob(id: number) {
  await prisma.job.delete({
    where: { id }
  });
  
  revalidatePath("/");
}

export async function updateJob(id: number, data: {
  company?: string;
  position?: string;
  status?: string;
  notes?: string;
}) {
  await prisma.job.update({
    where: { id },
    data
  });
  
  revalidatePath("/");
}