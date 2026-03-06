import sql from '@/lib/db';
import type { User } from '@/types';

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const rows = await sql<(User & { password_hash: string })[]>`
    SELECT * FROM users WHERE email = ${email.toLowerCase().trim()} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = await sql<User[]>`
    SELECT id, email, name, title, phone, location, linkedin_url, github_url,
           portfolio_url, bio, target_role, target_salary_min, target_salary_max,
           created_at, updated_at
    FROM users WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string, name: string): Promise<User> {
  const rows = await sql<User[]>`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email.toLowerCase().trim()}, ${passwordHash}, ${name})
    RETURNING id, email, name, title, phone, location, linkedin_url, github_url,
              portfolio_url, bio, target_role, target_salary_min, target_salary_max,
              created_at, updated_at
  `;
  return rows[0];
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const allowed = ['name','title','phone','location','linkedin_url','github_url',
                   'portfolio_url','bio','target_role','target_salary_min','target_salary_max'];
  const entries = Object.entries(data).filter(([k]) => allowed.includes(k));
  if (entries.length === 0) return getUserById(id);
  
  const setClauses = entries.map(([k], i) => `${k} = $${i + 2}`).join(', ');
  const values = entries.map(([, v]) => v);
  
  const rows = await sql<User[]>`
    UPDATE users SET ${sql.unsafe(setClauses)} WHERE id = ${id}
    RETURNING id, email, name, title, phone, location, linkedin_url, github_url,
              portfolio_url, bio, target_role, target_salary_min, target_salary_max,
              created_at, updated_at
  `;
  return rows[0] ?? null;
}
