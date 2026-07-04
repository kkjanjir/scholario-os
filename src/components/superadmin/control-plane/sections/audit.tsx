"use client"

import { SectionCard } from "@/components/shared/ui"
import { AUDIT_LOG } from "@/lib/mock/superadmin-data"
import { cn } from "@/lib/utils"
import { History, Download } from "lucide-react"
import { toast } from "sonner"

export function AuditSection() {
  return (
    <div className="space-y-4">
      <SectionCard title="Change Tracking" subtitle="Audit trail of administrative configuration changes" action={<button onClick={() => toast.success("Audit log exported")} className="inline-flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-accent"><Download className="h-3.5 w-3.5" /> Export</button>} bodyClassName="p-0">
        <div className="divide-y divide-border/40">
          {AUDIT_LOG.map((a) => (
            <div key={a.id} className="px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-muted p-1.5"><History className="h-3.5 w-3.5 text-muted-foreground" /></div>
                <p className="flex-1 text-sm font-medium">{a.action}</p>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{a.module}</span>
                <span className="text-[10px] text-muted-foreground">{a.time}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2 pl-9 text-xs">
                <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-rose-600 line-through">{a.oldValue}</span>
                <span>→</span>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-600">{a.newValue}</span>
                <span className="ml-auto text-muted-foreground">by {a.user}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
