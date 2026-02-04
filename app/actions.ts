"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

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
    // Crucial: Convert to plain object to prevent "Hanging Action"
    return { success: true, data: JSON.parse(JSON.stringify(newJob)) };
  } catch (error) {
    console.error("DATABASE_WRITE_ERROR:", error);
    return { success: false, error: "Database Write Failed" };
  }
}

export async function getJobs() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return JSON.parse(JSON.stringify(jobs));
  } catch (error) {
    return [];
  }
}

export async function deleteJob(id: number) {
  try {
    await prisma.job.delete({ where: { id } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}