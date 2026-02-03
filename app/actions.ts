"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

// This prevents Next.js from creating too many database connections during dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function addJob(formData: { company: string; position: string; status: string; dateApplied: string }) {
  await prisma.job.create({
    data: formData,
  });
  
  revalidatePath("/");
}

export async function getJobs() {
  return await prisma.job.findMany({
    orderBy: { createdAt: 'desc' }
  });
}