import { useMemo, useState } from 'react'
import { IconSearch, IconCar, IconInfoCircle, IconShieldCheck, IconCalendar } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockVehicles, mockInspections, mockWorkOrders, vehicleStatusConfig } from '@/data/mock'

export default function VehicleStatusPage() {
  const [plate, setPlate] = useState('')

  const selectedVehicle = useMemo(
    () =>
      mockVehicles.find((vehicle) =>
        vehicle.plate.toLowerCase() === plate.toLowerCase().trim()
      ),
    [plate]
  )

  const vehicleInspections = selectedVehicle
    ? mockInspections.filter((inspection) => inspection.vehiclePlate === selectedVehicle.plate)
    : []

  const vehicleWorkOrders = selectedVehicle
    ? mockWorkOrders.filter((workOrder) => workOrder.vehiclePlate === selectedVehicle.plate)
    : []

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconShieldCheck className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Vehicle Status</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Check your vehicle status</h1>
          <p className="text-muted-foreground text-sm">Enter your plate number to see service progress, inspection notes, and work orders.</p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Plate number (e.g. AA-3-04521)"
              value={plate}
              onChange={(event) => setPlate(event.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setPlate(plate.trim())} className="gap-2">
            <IconInfoCircle className="h-4 w-4" />
            Check status
          </Button>
        </div>

        {selectedVehicle ? (
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardContent>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold">{selectedVehicle.make} {selectedVehicle.model}</h2>
                  <Badge className={`${vehicleStatusConfig[selectedVehicle.status].bg} ${vehicleStatusConfig[selectedVehicle.status].color}`}>
                    {vehicleStatusConfig[selectedVehicle.status].label}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Plate</p>
                    <p className="text-base font-semibold">{selectedVehicle.plate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Customer</p>
                    <p className="text-base font-semibold">{selectedVehicle.customerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Year</p>
                    <p className="text-base font-semibold">{selectedVehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Mileage</p>
                    <p className="text-base font-semibold">{selectedVehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Color</p>
                    <p className="text-base font-semibold">{selectedVehicle.color}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">Last service</p>
                    <p className="text-base font-semibold">{selectedVehicle.lastService ?? 'Not available'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Search result</p>
                  <p className="text-lg font-semibold">Found your vehicle</p>
                </div>
                <div className="grid gap-3">
                  <div className="rounded-2xl bg-muted p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconCar className="h-4 w-4" />
                      <span>Service progress</span>
                    </div>
                    <p className="mt-2 text-base">{vehicleStatusConfig[selectedVehicle.status].label}</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconCalendar className="h-4 w-4" />
                      <span>Next update</span>
                    </div>
                    <p className="mt-2 text-base">Updates appear when inspections and work orders change.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          plate.trim() && (
            <Card>
              <CardContent>
                <p className="text-muted-foreground">No vehicle was found for that plate number. Check that the plate is correct and try again.</p>
              </CardContent>
            </Card>
          )
        )}

        {selectedVehicle ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold">Inspection records</h3>
                {vehicleInspections.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {vehicleInspections.map((inspection) => (
                      <div key={inspection.id} className="rounded-2xl border border-muted/70 p-4">
                        <p className="text-sm text-muted-foreground">Inspector: {inspection.inspectorName}</p>
                        <p className="mt-2 font-semibold">Status: {inspection.status.replace('_', ' ')}</p>
                        <p className="text-sm text-muted-foreground">Estimate: ETB {inspection.totalEstimate.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-muted-foreground">No inspections recorded yet for this vehicle.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold">Work orders</h3>
                {vehicleWorkOrders.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {vehicleWorkOrders.map((order) => (
                      <div key={order.id} className="rounded-2xl border border-muted/70 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold">{order.status.replace('_', ' ')}</p>
                          <Badge>{order.priority}</Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Technician: {order.technicianName ?? 'Not assigned'}</p>
                        <p className="mt-2 text-sm">{order.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-muted-foreground">No active work orders for this vehicle.</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </Main>
    </>
  )
}
