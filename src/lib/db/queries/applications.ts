import sql from '@/lib/db';
import type { Application, ApplicationEvent, CreateApplicationRequest, DashboardStats, ApplicationStatus } from '@/types';
import { STATUS_ORDER } from '@/types';

export async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  return sql<Application[]>`
    SELECT * FROM applications WHERE user_id = ${userId} ORDER BY updated_at DESC
  `;
}

export async function getApplicationById(id: string, userId: string): Promise<Application | null> {
  const rows = await sql<Application[]>`
    SELECT * FROM applications WHERE id = ${id} AND user_id = ${userId} LIMIT 1
  `;
  if (!rows[0]) return null;
  const app = rows[0];
  app.events = await sql<ApplicationEvent[]>`
    SELECT * FROM application_events WHERE application_id = ${id} ORDER BY event_date DESC, created_at DESC
  `;
  return app;
}

export async function createApplication(userId: string, data: CreateApplicationRequest): Promise<Application> {
  const rows = await sql<Application[]>`
    INSERT INTO applications (
      user_id, company_name, job_title, job_url, status, priority,
      salary_min, salary_max, salary_currency, location, work_type,
      job_description, application_date, deadline_date, notes,
      cover_letter_used, source, excitement_level
    ) VALUES (
      ${userId}, ${data.company_name}, ${data.job_title}, ${data.job_url ?? null},
      ${data.status ?? 'wishlist'}, ${data.priority ?? 'medium'},
      ${data.salary_min ?? null}, ${data.salary_max ?? null}, ${"USD"},
      ${data.location ?? null}, ${data.work_type ?? 'onsite'},
      ${data.job_description ?? null}, ${data.application_date ?? null},
      ${data.deadline_date ?? null}, ${data.notes ?? null},
      ${data.cover_letter_used ?? false}, ${data.source ?? null},
      ${data.excitement_level ?? null}
    )
    RETURNING *
  `;
  const app = rows[0];
  // Auto-create initial event
  if (data.status && data.status !== 'wishlist') {
    await createEvent(app.id, 'applied', 'Application submitted', null, data.application_date ?? new Date().toISOString());
  }
  return app;
}

export async function updateApplication(id: string, userId: string, data: Partial<Application>): Promise<Application | null> {
  const rows = await sql<Application[]>`
    UPDATE applications SET
      company_name        = COALESCE(${data.company_name ?? null}, company_name),
      job_title           = COALESCE(${data.job_title ?? null}, job_title),
      job_url             = COALESCE(${data.job_url ?? null}, job_url),
      status              = COALESCE(${data.status ?? null}, status),
      priority            = COALESCE(${data.priority ?? null}, priority),
      salary_min          = COALESCE(${data.salary_min ?? null}, salary_min),
      salary_max          = COALESCE(${data.salary_max ?? null}, salary_max),
      location            = COALESCE(${data.location ?? null}, location),
      work_type           = COALESCE(${data.work_type ?? null}, work_type),
      job_description     = COALESCE(${data.job_description ?? null}, job_description),
      application_date    = COALESCE(${data.application_date ?? null}, application_date),
      deadline_date       = COALESCE(${data.deadline_date ?? null}, deadline_date),
      next_follow_up_date = COALESCE(${data.next_follow_up_date ?? null}, next_follow_up_date),
      notes               = COALESCE(${data.notes ?? null}, notes),
      cover_letter_used   = COALESCE(${data.cover_letter_used ?? null}, cover_letter_used),
      source              = COALESCE(${data.source ?? null}, source),
      excitement_level    = COALESCE(${data.excitement_level ?? null}, excitement_level)
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `;
  return rows[0] ?? null;
}

export async function deleteApplication(id: string, userId: string): Promise<boolean> {
  const result = await sql`DELETE FROM applications WHERE id = ${id} AND user_id = ${userId}`;
  return result.count > 0;
}

export async function createEvent(
  applicationId: string,
  eventType: string,
  title: string,
  description: string | null,
  eventDate: string | null
): Promise<ApplicationEvent> {
  const rows = await sql<ApplicationEvent[]>`
    INSERT INTO application_events (application_id, event_type, title, description, event_date)
    VALUES (${applicationId}, ${eventType}, ${title}, ${description}, ${eventDate ?? new Date().toISOString()})
    RETURNING *
  `;
  return rows[0];
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const apps = await sql<{ status: ApplicationStatus; application_date: string | null; created_at: string }[]>`
    SELECT status, application_date, created_at FROM applications WHERE user_id = ${userId}
  `;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const byStatus: Record<ApplicationStatus, number> = {
    wishlist: 0, applied: 0, phone_screen: 0, interview: 0,
    offer: 0, rejected: 0, withdrawn: 0, ghosted: 0,
  };
  let thisWeek = 0, thisMonth = 0;

  for (const app of apps) {
    byStatus[app.status] = (byStatus[app.status] ?? 0) + 1;
    const date = new Date(app.application_date ?? app.created_at);
    if (date >= weekAgo) thisWeek++;
    if (date >= monthAgo) thisMonth++;
  }

  const total = apps.length;
  const submitted = apps.filter(a => a.status !== 'wishlist').length;
  const active = byStatus.applied + byStatus.phone_screen + byStatus.interview;
  const responseRate = submitted > 0 ? Math.round(((byStatus.phone_screen + byStatus.interview + byStatus.offer) / submitted) * 100) : 0;
  const interviewRate = submitted > 0 ? Math.round(((byStatus.interview + byStatus.offer) / submitted) * 100) : 0;
  const offerRate = submitted > 0 ? Math.round((byStatus.offer / submitted) * 100) : 0;

  return { total, by_status: byStatus, active, response_rate: responseRate, interview_rate: interviewRate, offer_rate: offerRate, this_week: thisWeek, this_month: thisMonth };
}
