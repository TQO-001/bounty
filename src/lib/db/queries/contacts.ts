import sql from "@/lib/db";
import type { Contact } from "@/types";

export async function getContactsByUserId(userId: string): Promise<Contact[]> {
  return sql<Contact[]>`
    SELECT c.*, comp.name as company_name
    FROM contacts c
    LEFT JOIN companies comp ON comp.id = c.company_id
    WHERE c.user_id = ${userId}
    ORDER BY c.name ASC
  `;
}

export async function createContact(userId: string, data: Partial<Contact>): Promise<Contact> {
  const rows = await sql<Contact[]>`
    INSERT INTO contacts (user_id, company_id, application_id, name, title, email, phone, linkedin_url, relationship, notes)
    VALUES (${userId}, ${data.company_id ?? null}, ${data.application_id ?? null}, ${data.name!},
            ${data.title ?? null}, ${data.email ?? null}, ${data.phone ?? null},
            ${data.linkedin_url ?? null}, ${data.relationship ?? "recruiter"}, ${data.notes ?? null})
    RETURNING *
  `;
  return rows[0];
}

export async function deleteContact(id: string, userId: string): Promise<boolean> {
  const result = await sql`DELETE FROM contacts WHERE id = ${id} AND user_id = ${userId}`;
  return result.count > 0;
}
