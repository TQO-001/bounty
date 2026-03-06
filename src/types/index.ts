// src/types/index.ts
export interface User {
  id: string; email: string; name: string; title: string | null;
  phone: string | null; location: string | null; linkedin_url: string | null;
  github_url: string | null; portfolio_url: string | null; bio: string | null;
  target_role: string | null; target_salary_min: number | null;
  target_salary_max: number | null; created_at: string; updated_at: string;
}
export interface JWTPayload { userId: string; email: string; name: string; iat: number; exp: number; }
export type ApplicationStatus = "wishlist" | "applied" | "phone_screen" | "interview" | "offer" | "rejected" | "withdrawn" | "ghosted";
export type ApplicationPriority = "low" | "medium" | "high";
export type WorkType = "onsite" | "remote" | "hybrid";
export const STATUS_LABELS: Record<ApplicationStatus, string> = { wishlist:"Wishlist", applied:"Applied", phone_screen:"Phone Screen", interview:"Interview", offer:"Offer", rejected:"Rejected", withdrawn:"Withdrawn", ghosted:"Ghosted" };
export const STATUS_COLORS: Record<ApplicationStatus, string> = { wishlist:"bg-gray-500/20 text-gray-300 border-gray-500/30", applied:"bg-blue-500/20 text-blue-300 border-blue-500/30", phone_screen:"bg-yellow-500/20 text-yellow-300 border-yellow-500/30", interview:"bg-purple-500/20 text-purple-300 border-purple-500/30", offer:"bg-green-500/20 text-green-300 border-green-500/30", rejected:"bg-red-500/20 text-red-300 border-red-500/30", withdrawn:"bg-orange-500/20 text-orange-300 border-orange-500/30", ghosted:"bg-slate-500/20 text-slate-400 border-slate-500/30" };
export const STATUS_ORDER: ApplicationStatus[] = ["wishlist","applied","phone_screen","interview","offer","rejected","withdrawn","ghosted"];
export interface Application { id: string; user_id: string; company_id: string|null; company_name: string; job_title: string; job_url: string|null; status: ApplicationStatus; priority: ApplicationPriority; salary_min: number|null; salary_max: number|null; salary_currency: string; location: string|null; work_type: WorkType; job_description: string|null; application_date: string|null; deadline_date: string|null; next_follow_up_date: string|null; notes: string|null; cover_letter_used: boolean; source: string|null; excitement_level: number|null; created_at: string; updated_at: string; events?: ApplicationEvent[]; contacts?: Contact[]; }
export type EventType = "applied" | "status_change" | "note" | "interview" | "phone_call" | "email" | "offer" | "rejection" | "follow_up" | "other";
export interface ApplicationEvent { id: string; application_id: string; event_type: EventType; title: string; description: string|null; event_date: string|null; created_at: string; }
export type ContactRelationship = "recruiter" | "hiring_manager" | "interviewer" | "employee" | "referral" | "other";
export interface Contact { id: string; user_id: string; company_id: string|null; application_id: string|null; name: string; title: string|null; email: string|null; phone: string|null; linkedin_url: string|null; relationship: ContactRelationship; notes: string|null; last_contacted: string|null; company_name?: string; created_at: string; updated_at: string; }
export interface Company { id: string; user_id: string; name: string; website: string|null; industry: string|null; size: string|null; notes: string|null; created_at: string; updated_at: string; }
export type DocType = "resume" | "cover_letter" | "portfolio" | "reference" | "other";
export interface Document { id: string; user_id: string; name: string; doc_type: DocType; version: string|null; storage_path: string|null; file_size: number; is_default: boolean; notes: string|null; created_at: string; }
export interface CreateApplicationRequest { company_name: string; job_title: string; job_url?: string; status?: ApplicationStatus; priority?: ApplicationPriority; salary_min?: number; salary_max?: number; location?: string; work_type?: WorkType; job_description?: string; application_date?: string; deadline_date?: string; notes?: string; cover_letter_used?: boolean; source?: string; excitement_level?: number; }
export interface DashboardStats { total: number; by_status: Record<ApplicationStatus, number>; active: number; response_rate: number; interview_rate: number; offer_rate: number; this_week: number; this_month: number; }
