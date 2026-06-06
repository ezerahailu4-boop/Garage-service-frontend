import { useState } from 'react'
import {
  IconClipboardList,
  IconPlus,
  IconAlertTriangle,
  IconAlertCircle,
  IconInfoCircle,
  IconCircleCheck,
  IconClockHour4,
  IconUser,
} from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { mockInspections, severityConfig, type Severity } from '@/data/mock'

const severityIcons: Record<Severity, React.ReactNode> = {
  critical: <IconAlertTriangle className="h-4 w-4 text-red-500" />,
  high: <IconAlertCircle className="h-4 w-4 text-orange-500" />,
  medium: <IconInfoCircle className="h-4 w-4 text-amber-500" />,
  low: <IconCircleCheck className="h-4 w-4 text-green-500" />,
}

const statusBadge: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800' },
  in_progress: { label: 'In Progress', className: 'bg-blue-50 text-blue-600 dark:bg-blue-950' },
  completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950' },
  reviewed: { label: 'Reviewed', className: 'bg-violet-50 text-violet-600 dark:bg-violet-950' },
}

export default function Inspections() {
  const [selected, setSelected] = useState(mockInspections[0])

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconClipboardList className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Inspections</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button className="gap-2" size="sm">
            <IconPlus className="h-4 w-4" />
            New Inspection
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Inspections</h1>
          <p className="text-muted-foreground text-sm">{mockInspections.length} total inspections</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left — Inspection List */}
          <div className="lg:col-span-2 space-y-3">
            {mockInspections.map((insp) => {
              const sb = statusBadge[insp.status]
              const isSelected = selected?.id === insp.id
              return (
                <Card
                  key={insp.id}
                  onClick={() => setSelected(insp)}
                  className={`cursor-pointer transition-all ${isSelected ? 'ring-primary ring-2' : 'hover:border-primary/30 hover:shadow-sm'}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-sm">{insp.vehicleName}</p>
                        <p className="text-muted-foreground text-xs">{insp.vehiclePlate}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${sb.className}`}>
                        {sb.label}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IconUser className="h-3 w-3" />
                        {insp.customerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconClockHour4 className="h-3 w-3" />
                        {new Date(insp.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">{insp.findings.length} findings</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm font-medium">ETB {insp.totalEstimate.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Right — Inspection Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{selected.vehicleName}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        Inspected by <span className="font-medium">{selected.inspectorName}</span>
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Generate Quote</Button>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
                      <p className="text-xs text-muted-foreground">Customer</p>
                      <p className="text-sm font-semibold">{selected.customerName}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
                      <p className="text-xs text-muted-foreground">Findings</p>
                      <p className="text-sm font-semibold">{selected.findings.length}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg px-3 py-2 text-center">
                      <p className="text-xs text-muted-foreground">Estimate</p>
                      <p className="text-sm font-semibold">ETB {selected.totalEstimate.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Findings</h3>
                  {selected.findings.map((finding) => {
                    const sc = severityConfig[finding.severity]
                    return (
                      <div
                        key={finding.id}
                        className={`rounded-xl border p-4 ${sc.bg} ${sc.border}`}
                      >
                        <div className="flex items-start gap-2">
                          {severityIcons[finding.severity]}
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-sm">{finding.title}</p>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.color}`}>
                                {sc.label}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-xs mt-1">{finding.category}</p>
                            <p className="text-sm mt-2">{finding.description}</p>
                            <div className="mt-3 flex flex-wrap gap-4 text-xs">
                              <div>
                                <span className="text-muted-foreground">Action: </span>
                                <span className="font-medium">{finding.recommendedAction}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Labor: </span>
                                <span className="font-medium">{finding.laborHours}h</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Est. Cost: </span>
                                <span className="font-medium">ETB {finding.estimatedCost.toLocaleString()}</span>
                              </div>
                            </div>
                            {finding.parts.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {finding.parts.map((p) => (
                                  <span key={p} className="bg-background/60 rounded-md border px-2 py-0.5 text-xs">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">Select an inspection to view details</p>
              </div>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}
