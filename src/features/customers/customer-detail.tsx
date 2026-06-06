import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { IconArrowLeft, IconCar, IconReceipt, IconWrench, IconClipboardCheck, IconCurrencyDollar } from '@tabler/icons-react'
import { useNavigate, useRouteContext } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import type { Customer, Vehicle, Inspection, Invoice, WorkOrder } from '@/types/garage'
import { useGarageStore } from '@/stores/garageStore'

export function CustomerDetail() {
  const navigate = useNavigate()
  const customerId = useRouteContext({ from: '/_authenticated/customers/$customerId' }) as string
  const { fetchCustomer, selectedCustomer, vehicles, inspections, invoices, workOrders, fetchVehicles, fetchInspections, fetchInvoices, fetchWorkOrders } = useGarageStore()

  useEffect(() => {
    if (customerId) {
      fetchCustomer(customerId)
    }
  }, [fetchCustomer, customerId])

  const customerVehicles = useMemo(() => {
    if (!selectedCustomer) return []
    return vehicles.filter((v) => v.customerId === selectedCustomer.id)
  }, [vehicles, selectedCustomer])

  const customerInspections = useMemo(() => {
    if (!selectedCustomer) return []
    return inspections.filter((i) => {
      const vehicle = vehicles.find((v) => v.id === i.vehicleId)
      return vehicle?.customerId === selectedCustomer.id
    })
  }, [inspections, vehicles, selectedCustomer])

  const customerInvoices = useMemo(() => {
    if (!selectedCustomer) return []
    return invoices.filter((inv) => inv.customerId === selectedCustomer.id)
  }, [invoices, selectedCustomer])

  const customerWorkOrders = useMemo(() => {
    if (!selectedCustomer) return []
    return workOrders.filter((wo) => wo.customerId === selectedCustomer.id)
  }, [workOrders, selectedCustomer])

  useEffect(() => {
    fetchVehicles()
    fetchInspections()
    fetchInvoices()
    fetchWorkOrders()
  }, [fetchVehicles, fetchInspections, fetchInvoices, fetchWorkOrders])

  if (!selectedCustomer) {
    return (
      <>
        <Header fixed>
          <Search />
          <div className='ml-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='flex items-center justify-center h-[60vh]'>
            <p className='text-muted-foreground'>Loading customer...</p>
          </div>
        </Main>
      </>
    )
  }

  const totalVehicles = customerVehicles.length
  const totalSpent = customerInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const visitsCount = customerWorkOrders.length

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='flex items-center gap-4 mb-6'>
          <Button variant='ghost' size='icon' onClick={() => navigate({ to: '/customers' })}>
            <IconArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {selectedCustomer.firstName} {selectedCustomer.lastName}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-3 mb-6'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalVehicles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{visitsCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-2'>
            <div className='flex gap-4'>
              <div>
                <p className='text-xs text-muted-foreground'>Email</p>
                <p className='text-sm font-medium'>{selectedCustomer.email}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Phone</p>
                <p className='text-sm font-medium'>{selectedCustomer.phone}</p>
              </div>
              {selectedCustomer.alternatePhone && (
                <div>
                  <p className='text-xs text-muted-foreground'>Alt Phone</p>
                  <p className='text-sm font-medium'>{selectedCustomer.alternatePhone}</p>
                </div>
              )}
            </div>
            {selectedCustomer.address && (
              <div>
                <p className='text-xs text-muted-foreground'>Address</p>
                <p className='text-sm font-medium'>
                  {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}
                </p>
              </div>
            )}
            {selectedCustomer.notes && (
              <div>
                <p className='text-xs text-muted-foreground'>Notes</p>
                <p className='text-sm font-medium'>{selectedCustomer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue='vehicles'>
          <TabsList>
            <TabsTrigger value='vehicles' className='flex items-center gap-2'>
              <IconCar className='h-4 w-4' />
              Vehicles ({totalVehicles})
            </TabsTrigger>
            <TabsTrigger value='service-history' className='flex items-center gap-2'>
              <IconWrench className='h-4 w-4' />
              Service History ({visitsCount})
            </TabsTrigger>
            <TabsTrigger value='payments' className='flex items-center gap-2'>
              <IconReceipt className='h-4 w-4' />
              Payments ({customerInvoices.length})
            </TabsTrigger>
            <TabsTrigger value='inspections' className='flex items-center gap-2'>
              <IconClipboardCheck className='h-4 w-4' />
              Inspections ({customerInspections.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='vehicles' className='mt-4'>
            <Card>
              <CardContent>
                {customerVehicles.length === 0 ? (
                  <p className='text-center text-muted-foreground py-8'>No vehicles found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Make/Model</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>VIN</TableHead>
                        <TableHead>License Plate</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className='font-medium'>{vehicle.make} {vehicle.model}</TableCell>
                          <TableCell>{vehicle.year}</TableCell>
                          <TableCell className='font-mono text-xs'>{vehicle.vin.slice(0, 17)}</TableCell>
                          <TableCell>{vehicle.licensePlate}</TableCell>
                          <TableCell>
                            <Badge className='capitalize'>{vehicle.status.replace('_', ' ')}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='service-history' className='mt-4'>
            <Card>
              <CardContent>
                {customerWorkOrders.length === 0 ? (
                  <p className='text-center text-muted-foreground py-8'>No service history found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Work Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Labor Hours</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerWorkOrders.map((wo) => (
                        <TableRow key={wo.id}>
                          <TableCell className='font-mono font-medium'>WO-{wo.id.slice(0, 8).toUpperCase()}</TableCell>
                          <TableCell>
                            <Badge className='capitalize'>{wo.status.replace('_', ' ')}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant='outline'>{wo.priority}</Badge>
                          </TableCell>
                          <TableCell>{wo.totalLaborHours}</TableCell>
                          <TableCell>{new Date(wo.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='payments' className='mt-4'>
            <Card>
              <CardContent>
                {customerInvoices.length === 0 ? (
                  <p className='text-center text-muted-foreground py-8'>No payments found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Paid</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerInvoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className='font-mono font-medium'>{inv.invoiceNumber}</TableCell>
                          <TableCell>
                            <Badge className='capitalize'>{inv.status}</Badge>
                          </TableCell>
                          <TableCell>${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>${inv.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>${inv.dueAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='inspections' className='mt-4'>
            <Card>
              <CardContent>
                {customerInspections.length === 0 ? (
                  <p className='text-center text-muted-foreground py-8'>No inspections found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Inspection</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Findings</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerInspections.map((insp) => (
                        <TableRow key={insp.id}>
                          <TableCell className='font-mono font-medium'>INS-{insp.id.slice(0, 8).toUpperCase()}</TableCell>
                          <TableCell>
                            <Badge className='capitalize'>{insp.status}</Badge>
                          </TableCell>
                          <TableCell>{insp.findings.length} issues</TableCell>
                          <TableCell>{insp.overallCondition}</TableCell>
                          <TableCell>{new Date(insp.startedAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}