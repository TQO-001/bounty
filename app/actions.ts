"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Robust Prisma initialization for Next.js 15+
const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function addJob(data: { 
  company: string; 
  position: string; 
  status: string; 
  dateApplied: string 
}) {
  try {
    const newJob = await prisma.job.create({
      data: {
        company: data.company,
        position: data.position,
        status: data.status,
        dateApplied: data.dateApplied,
        notes: "", 
      },
    });
    
    revalidatePath("/");
    return { success: true, data: newJob };
  } catch (error) {
    console.error("DATABASE_ERROR:", error);
    return { success: false, error: String(error) };
  }
}

export async function getJobs() {
  try {
    return await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("FETCH_ERROR:", error);
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
    console.error("DELETE_ERROR:", error);
    return { success: false };
  }
}