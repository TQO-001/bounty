"use client"
import { useState, useEffect } from "react"
import { Plus, Mail, Linkedin, Trash2, X, Users } from "lucide-react"
import type { Contact } from "@/types"
export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name:"",email:"",phone:"",company:"",role:"",linkedin_url:"",notes:"" })
  const [saving, setSaving] = useState(false)
  useEffect(() => { fetch("/api/contacts").then(r=>r.json()).then(d=>{ setContacts(d); setLoading(false) }) }, [])
  async function add(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const res = await fetch("/api/contacts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)})
    if(res.ok){const c=await res.json();setContacts(p=>[c,...p]);setShowForm(false);setForm({name:"",email:"",phone:"",company:"",role:"",linkedin_url:"",notes:""})}
    setSaving(false)
  }
  async function del(id: string) {
    if(!confirm("Delete contact?")) return
    await fetch("/api/contacts/"+id,{method:"DELETE"})
    setContacts(p=>p.filter(c=>c.id!==id))
  }
  return (
    <div className="page-pad p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold" style={{color:"var(--text)"}}>Contacts</h1><p className="text-sm mt-0.5" style={{color:"var(--muted-2)"}}>{contacts.length} contact{contacts.length!==1?"s":""}</p></div>
        <button onClick={()=>setShowForm(v=>!v)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-black" style={{background:"var(--amber)"}}><Plus size={14}/>Add contact</button>
      </div>
      {showForm && (
        <div className="rounded-xl p-6 mb-6" style={{background:"var(--surface)",border:"1px solid var(--amber-border)"}}>
          <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-semibold" style={{color:"var(--text)"}}>New contact</h2><button onClick={()=>setShowForm(false)}><X size={16} style={{color:"var(--muted)"}}/></button></div>
          <form onSubmit={add} className="grid grid-cols-2 gap-4">
            {[["Name *","name","text",true],["Email","email","email",false],["Phone","phone","tel",false],["Company","company","text",false],["Role","role","text",false],["LinkedIn URL","linkedin_url","url",false]].map(([l,k,t,req])=>(
              <div key={k as string}><label className="block text-xs mb-1" style={{color:"var(--muted)"}}>{l}</label>
                <input type={t as string} value={(form as Record<string,string>)[k as string]} onChange={e=>setForm(p=>({...p,[k as string]:e.target.value}))} required={req as boolean} className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none" style={{background:"var(--input-bg)",border:"1px solid var(--border-2)",color:"var(--text)"}}/></div>
            ))}
            <div className="col-span-2"><label className="block text-xs mb-1" style={{color:"var(--muted)"}}>Notes</label>
              <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={2} className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none resize-none" style={{background:"var(--input-bg)",border:"1px solid var(--border-2)",color:"var(--text)"}}/></div>
            <div className="col-span-2 flex gap-2"><button type="submit" disabled={saving} className="px-5 py-2 rounded-lg text-sm font-semibold text-black disabled:opacity-50" style={{background:"var(--amber)"}}>{saving?"Saving…":"Save contact"}</button><button type="button" onClick={()=>setShowForm(false)} className="text-sm px-4 py-2" style={{color:"var(--muted-2)"}}>Cancel</button></div>
          </form>
        </div>
      )}
      {!loading && contacts.length===0&&!showForm && (
        <div className="text-center py-16"><Users size={32} className="mx-auto mb-4" style={{color:"var(--muted)"}}/><h3 className="font-semibold mb-1" style={{color:"var(--text)"}}>No contacts yet</h3><p className="text-sm" style={{color:"var(--muted-2)"}}>Add recruiters, hiring managers, or connections.</p></div>
      )}
      <div className="space-y-2">
        {contacts.map(c=>(
          <div key={c.id} className="flex items-center gap-4 px-5 py-4 rounded-xl" style={{background:"var(--surface)",border:"1px solid var(--border)"}}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{background:"var(--amber-dim)",color:"var(--amber)",border:"1px solid var(--amber-border)"}}>{c.name.charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{color:"var(--text)"}}>{c.name}</p>
              <p className="text-xs" style={{color:"var(--muted-2)"}}>{[c.role,c.company].filter(Boolean).join(" @ ")}</p>
            </div>
            <div className="flex items-center gap-1">
              {c.email&&<a href={"mailto:"+c.email} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{color:"var(--muted)"}} title={c.email}><Mail size={14}/></a>}
              {c.linkedin_url&&<a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-lg" style={{color:"var(--muted)"}}><Linkedin size={14}/></a>}
              <button onClick={()=>del(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{color:"var(--muted)"}}><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
