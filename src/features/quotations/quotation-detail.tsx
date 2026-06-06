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
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { IconArrowLeft, IconWrench } from '@tabler/icons-react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { QUOTATION_STATUS, WORK_ORDER_STATUS } from '../lib/quotations-constants'
import type { Quotation, QuotationItem, Inspection, Customer, Vehicle } from '@/types/garage'
import { useGarageStore } from '@/stores/garageStore'

const ITEM_TYPE_COLORS: Record<string, string> = {
  part: 'bg-blue-100 text-blue-700',
  labor: 'bg-purple-100 text-purple-700',
  service: 'bg-amber-100 text-amber-700',
}

export function QuotationDetail() {
  const { quotationId } = useParams({ from: '/_authenticated/quotations/$quotationId' })
  const navigate = useNavigate()
  const { fetchQuotation, updateQuotationStatus, selectedQuotation, fetchCustomers, fetchVehicles, fetchInspections, customers, vehicles, inspections, createWorkOrder } = useGarageStore()

  const [localQuotation, setLocalQuotation] = useState<Quotation | null>(null)

  useEffect(() => {
    fetchQuotation(quotationId)
  }, [fetchQuotation, quotationId])

  useEffect(() => {
    if (selectedQuotation) {
      setLocalQuotation(selectedQuotation)
    }
  }, [selectedQuotation])

  const customer = useMemo(
    () => customers.find((c) => c.id === localQuotation?.customerId),
    [customers, localQuotation]
  )

  const vehicle = useMemo(
    () => vehicles.find((v) => v.id === localQuotation?.vehicleId),
    [vehicles, localQuotation]
  )

  const inspection = useMemo(
    () => inspections.find((i) => i.id === localQuotation?.inspectionId),
    [inspections, localQuotation]
  )

  useEffect(() => {
    fetchCustomers()
    fetchVehicles()
    fetchInspections()
  }, [fetchCustomers, fetchVehicles, fetchInspections])

  if (!localQuotation) {
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
            <p className='text-muted-foreground'>Loading quotation...</p>
          </div>
        </Main>
      </>
    )
  }

  const subtotal = localQuotation.subtotal
  const tax = localQuotation.taxAmount
  const discount = localQuotation.discountAmount
  const serviceCharges = localQuotation.serviceCharges
  const total = localQuotation.totalAmount

  const handleStatusChange = async (newStatus: string) => {
    const updated = await updateQuotationStatus(localQuotation.id, newStatus as Quotation['status'])
    if (updated) {
      setLocalQuotation(updated)
    }
  }

  const handleCreateWorkOrder = () => {
    navigate({ to: '/work-orders', search: { quotationId: localQuotation.id } })
  }

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
          <Button variant='ghost' size='icon' onClick={() => navigate({ to: '/quotations' })}>
            <IconArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Quotation QT-{localQuotation.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Created {new Date(localQuotation.createdAt).toLocaleDateString()} &bull; Valid until {new Date(localQuotation.validUntil).toLocaleDateString()}
            </p>
          </div>
          <div className='ml-auto'>
            <Badge className={`${QUOTATION_STATUS[localQuotation.status]?.color || 'bg-gray-100 text-gray-700'} border-0 text-xs font-medium px-3 py-1`}>
              {QUOTATION_STATUS[localQuotation.status]?.label || localQuotation.status}
            </Badge>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Parts Cost</span>
                    <span>${localQuotation.items.filter(i => i.type === 'part').reduce((s, i) => s + i.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Labor Cost</span>
                    <span>${localQuotation.items.filter(i => i.type === 'labor').reduce((s, i) => s + i.total, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Service Charges</span>
                    <span>${localQuotation.serviceCharges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Separator />
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Subtotal</span>
                    <span className='font-medium'>${localQuotation.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Tax ({Math.round(localQuotation.taxRate * 100)}%)</span>
                    <span>${localQuotation.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Discount ({Math.round(localQuotation.discountPercent * 100)}%)</span>
                    <span>-${localQuotation.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Separator />
                  <div className='flex justify-between text-lg font-bold'>
                    <span>TOTAL</span>
                    <span>${localQuotation.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Finding Ref</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localQuotation.items.map((item: QuotationItem) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge className={`${ITEM_TYPE_COLORS[item.type] || 'bg-gray-100 text-gray-700'} border-0 text-xs font-medium px-2 py-0.5`}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-sm'>{item.description}</TableCell>
                        <TableCell className='text-sm'>{item.quantity}</TableCell>
                        <TableCell className='text-sm'>${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className='text-sm font-medium'>${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className='text-sm font-mono text-xs'>{item.findingId ? item.findingId.slice(0, 8).toUpperCase() : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Customer & Vehicle</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-xs text-muted-foreground'>Customer</p>
                  <p className='text-sm font-medium'>{customer ? `${customer.firstName} ${customer.lastName}` : localQuotation.customerId.slice(0, 8).toUpperCase()}</p>
                  {customer && <p className='text-xs text-muted-foreground'>{customer.email} &bull; {customer.phone}</p>}
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Vehicle</p>
                  <p className='text-sm font-medium'>{vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : localQuotation.vehicleId.slice(0, 8).toUpperCase()}</p>
                  {vehicle && <p className='text-xs text-muted-foreground'>{vehicle.licensePlate} &bull; {vehicle.vin.slice(0, 17)}</p>}
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Inspection</p>
                  <p className='text-sm font-medium'>{inspection ? `INS-${inspection.id.slice(0, 8).toUpperCase()}` : localQuotation.inspectionId.slice(0, 8).toUpperCase()}</p>
                  {inspection && <p className='text-xs text-muted-foreground'>{inspection.findings.length} findings &bull; {inspection.overallCondition}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Approval</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  Review and approve or reject this quotation.
                </p>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    onClick={() => handleStatusChange('approved')}
                    disabled={localQuotation.status === 'approved'}
                    className='flex-1'
                  >
                    Approve
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleStatusChange('rejected')}
                    disabled={localQuotation.status === 'rejected'}
                    className='flex-1'
                  >
                    Reject
                  </Button>
                </div>
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full'
                  onClick={handleCreateWorkOrder}
                >
                  Create Work Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}
