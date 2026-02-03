'use server'
import { prisma } from '@/lib/prisma' // You'll set this helper up
import { revalidatePath } from 'next/cache'

export async function addJob(formData) {
  await prisma.job.create({
    data: {
      company: formData.get('company'),
      position: formData.get('position'),
      dateApplied: new Date(formData.get('dateApplied')),
      status: formData.get('status'),
      notes: formData.get('notes'),
    }
  })
  revalidatePath('/') // This tells Next.js to refresh the list automatically
}