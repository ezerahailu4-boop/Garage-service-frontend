import { useState } from 'react'
import { IconCar, IconSearch, IconPlus } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { mockVehicles, vehicleStatusConfig, type VehicleStatus } from '@/data/mock'

const STATUS_FILTERS: { value: VehicleStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'registered', label: 'Registered' },
  { value: 'under_inspection', label: 'Inspecting' },
  { value: 'awaiting_approval', label: 'Awaiting' },
  { value: 'in_repair', label: 'In Repair' },
  { value: 'quality_check', label: 'QC' },
  { value: 'ready', label: 'Ready' },
  { value: 'delivered', label: 'Delivered' },
]

export default function Vehicles() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all')

  const filtered = mockVehicles.filter((v) => {
    const matchSearch =
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.customerName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconCar className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Vehicles</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vehicles</h1>
            <p className="text-muted-foreground text-sm">{mockVehicles.length} vehicles registered</p>
          </div>
          <Button className="gap-2">
            <IconPlus className="h-4 w-4" />
            Register Vehicle
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="relative">
            <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search vehicles..."
              className="w-64 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((sf) => (
              <button
                key={sf.value}
                onClick={() => setStatusFilter(sf.value as VehicleStatus | 'all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  statusFilter === sf.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Plate</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Vehicle</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Customer</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Mileage</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Status</th>
                  <th className="text-muted-foreground px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Last Service</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((v) => {
                  const cfg = vehicleStatusConfig[v.status]
                  return (
                    <tr key={v.id} className="hover:bg-muted/30 cursor-pointer transition-colors">
                      <td className="px-4 py-3">
                        <span className="bg-muted rounded-md px-2 py-0.5 font-mono text-xs font-medium">
                          {v.plate}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{v.make} {v.model}</p>
                          <p className="text-muted-foreground text-xs">{v.year} · {v.color}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{v.customerName}</p>
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {v.mileage.toLocaleString()} km
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-xs">
                        {v.lastService ?? '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </Main>
    </>
  )
}
