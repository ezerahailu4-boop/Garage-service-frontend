import { useMemo, useState } from 'react'
import { IconClipboardList, IconSearch, IconCheck, IconUsers, IconCar } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockInspections, mockVehicles, vehicleStatusConfig } from '@/data/mock'

export default function InspectorPage() {
  const [search, setSearch] = useState('')

  const filteredInspections = useMemo(
    () =>
      mockInspections.filter((inspection) => {
        const query = search.toLowerCase().trim()
        return (
          inspection.vehiclePlate.toLowerCase().includes(query) ||
          inspection.customerName.toLowerCase().includes(query) ||
          inspection.inspectorName.toLowerCase().includes(query) ||
          inspection.status.toLowerCase().includes(query)
        )
      }),
    [search]
  )

  const totalAssigned = filteredInspections.length
  const inProgress = filteredInspections.filter((inspection) => inspection.status === 'in_progress').length
  const completed = filteredInspections.filter((inspection) => inspection.status === 'completed').length

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconClipboardList className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Inspector Dashboard</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <IconCheck className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="text-sm text-muted-foreground">Assigned inspections</p>
                <p className="text-xl font-semibold">{totalAssigned}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <IconCar className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Under inspection</p>
                <p className="text-xl font-semibold">{inProgress}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <IconUsers className="h-6 w-6 text-violet-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed today</p>
                <p className="text-xl font-semibold">{completed}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Inspection assignments</h1>
            <p className="text-muted-foreground text-sm">Search by plate, customer, inspector, or status.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Search inspections..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pr-10"
            />
            <IconSearch className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredInspections.map((inspection) => {
            const vehicle = mockVehicles.find((v) => v.plate === inspection.vehiclePlate)
            const status = vehicle ? vehicleStatusConfig[vehicle.status] : { label: inspection.status, color: 'text-slate-600', bg: 'bg-slate-100' }

            return (
              <Card key={inspection.id} className="border">
                <CardContent>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{inspection.vehiclePlate}</span>
                        <Badge className={`${status.bg} ${status.color}`}>{status.label}</Badge>
                      </div>
                      <h2 className="mt-2 text-lg font-semibold">{inspection.vehicleName}</h2>
                      <p className="text-sm text-muted-foreground">Customer: {inspection.customerName}</p>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Inspector: {inspection.inspectorName}</p>
                      <p>Status: {inspection.status.replace('_', ' ')}</p>
                      <p>Total estimate: ETB {inspection.totalEstimate.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredInspections.length === 0 ? (
            <Card>
              <CardContent>
                <p className="text-muted-foreground">No inspection records found for that search. Try a different plate or inspector name.</p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </Main>
    </>
  )
}
