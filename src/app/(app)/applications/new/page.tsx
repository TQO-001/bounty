"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
const S_LABELS: Record<string,string> = {wishlist:"Wishlist",applied:"Applied",phone_screen:"Phone Screen",interview:"Interview",offer:"Offer",rejected:"Rejected",withdrawn:"Withdrawn",ghosted:"Ghosted"}
export default function NewApplicationPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({company_name:"",job_title:"",job_url:"",status:"wishlist",priority:"medium",work_type:"onsite",location:"",salary_min:"",salary_max:"",application_date:"",source:"",excitement_level:"3",notes:"",job_description:"",deadline_date:"",next_follow_up_date:""})
  function set(k: string, v: string){ setForm(p=>({...p,[k]:v})) }
  async function submit(e: React.FormEvent){
    e.preventDefault();setSaving(true);setError("")
    const res = await fetch("/api/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,salary_min:form.salary_min?parseInt(form.salary_min):null,salary_max:form.salary_max?parseInt(form.salary_max):null,excitement_level:form.excitement_level?parseInt(form.excitement_level):null,job_url:form.job_url||null,location:form.location||null,application_date:form.application_date||null,source:form.source||null,notes:form.notes||null,job_description:form.job_description||null,deadline_date:form.deadline_date||null,next_follow_up_date:form.next_follow_up_date||null})})
    if(res.ok){const a=await res.json();router.push("/applications/"+a.id);router.refresh()}
    else{const d=await res.json();setError(d.error||"Failed");setSaving(false)}
  }
  return (
    <div style={{background:"var(--bg)",minHeight:"100vh"}}>
      <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3" style={{background:"var(--surface)",borderBottom:"1px solid var(--border)"}}>
        <Link href="/applications" className="flex items-center gap-1.5 text-sm" style={{color:"var(--muted-2)"}}><ArrowLeft size={15}/>Back</Link>
        <span style={{color:"var(--border-2)"}}>/</span>
        <span className="text-sm font-medium" style={{color:"var(--text)"}}>Add application</span>
      </div>
      <div className="max-w-2xl px-8 py-8">
        {error&&<div className="mb-5 px-4 py-3 rounded-lg text-sm" style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",color:"#fca5a5"}}>{error}</div>}
        <form onSubmit={submit} className="space-y-5">
          <Section title="Position">
            <div className="grid grid-cols-2 gap-4"><F l="Company *" k="company_name" v={form.company_name} set={set} req/><F l="Job title *" k="job_title" v={form.job_title} set={set} req/></div>
            <F l="Job URL" k="job_url" v={form.job_url} set={set} type="url"/>
            <div className="grid grid-cols-3 gap-4">
              <Sel l="Status" k="status" v={form.status} set={set} opts={Object.keys(S_LABELS)} lbls={S_LABELS}/>
              <Sel l="Work type" k="work_type" v={form.work_type} set={set} opts={["onsite","remote","hybrid"]}/>
              <F l="Location" k="location" v={form.location} set={set}/>
            </div>
          </Section>
          <Section title="Compensation & Dates">
            <div className="grid grid-cols-2 gap-4"><F l="Min salary" k="salary_min" v={form.salary_min} set={set} type="number"/><F l="Max salary" k="salary_max" v={form.salary_max} set={set} type="number"/></div>
            <div className="grid grid-cols-2 gap-4"><F l="Application date" k="application_date" v={form.application_date} set={set} type="date"/><F l="Source" k="source" v={form.source} set={set}/></div>
            <div className="grid grid-cols-2 gap-4"><F l="Deadline" k="deadline_date" v={form.deadline_date} set={set} type="date"/><F l="Follow-up date" k="next_follow_up_date" v={form.next_follow_up_date} set={set} type="date"/></div>
            <div className="grid grid-cols-2 gap-4">
              <Sel l="Priority" k="priority" v={form.priority} set={set} opts={["low","medium","high"]}/>
              <div><label className="block text-xs mb-1.5" style={{color:"var(--muted)"}}>Excitement ({form.excitement_level}/5)</label><input type="range" min="1" max="5" value={form.excitement_level} onChange={e=>set("excitement_level",e.target.value)} className="w-full" style={{accentColor:"var(--amber)",marginTop:4}}/></div>
            </div>
          </Section>
          <Section title="Notes"><TA l="Personal notes" k="notes" v={form.notes} set={set} rows={3}/><TA l="Job description" k="job_description" v={form.job_description} set={set} rows={4}/></Section>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-black disabled:opacity-50" style={{background:"var(--amber)"}}>{saving?"Saving…":"Add application"}</button>
            <Link href="/applications" className="px-4 py-2.5 text-sm" style={{color:"var(--muted-2)"}}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
function Section({title,children}:{title:string;children:React.ReactNode}){return<div className="rounded-xl p-6 space-y-4" style={{background:"var(--surface)",border:"1px solid var(--border)"}}><h2 className="text-xs font-semibold uppercase tracking-wider" style={{color:"var(--muted)"}}>{title}</h2>{children}</div>}
function F({l,k,v,set,req,type="text"}:{l:string;k:string;v:string;set:(k:string,v:string)=>void;req?:boolean;type?:string}){return<div><label className="block text-xs mb-1.5" style={{color:"var(--muted)"}}>{l}</label><input type={type} value={v} onChange={e=>set(k,e.target.value)} required={req} className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none" style={{background:"var(--input-bg)",border:"1px solid var(--border-2)",color:"var(--text)"}}/></div>}
function Sel({l,k,v,set,opts,lbls}:{l:string;k:string;v:string;set:(k:string,v:string)=>void;opts:string[];lbls?:Record<string,string>}){return<div><label className="block text-xs mb-1.5" style={{color:"var(--muted)"}}>{l}</label><select value={v} onChange={e=>set(k,e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none" style={{background:"var(--surface-3)",border:"1px solid var(--border-2)",color:"var(--text)"}}>{opts.map(o=><option key={o} value={o}>{lbls?.[o]??o.replace(/_/g," ")}</option>)}</select></div>}
function TA({l,k,v,set,rows=3}:{l:string;k:string;v:string;set:(k:string,v:string)=>void;rows?:number}){return<div><label className="block text-xs mb-1.5" style={{color:"var(--muted)"}}>{l}</label><textarea value={v} onChange={e=>set(k,e.target.value)} rows={rows} className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none resize-none" style={{background:"var(--input-bg)",border:"1px solid var(--border-2)",color:"var(--text)"}}/></div>}
