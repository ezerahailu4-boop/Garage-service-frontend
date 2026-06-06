import { useState, useEffect, useMemo, useRef } from 'react'
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
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from '@tanstack/react-router'
import { IconDots, IconPlus } from '@tabler/icons-react'
import { QUOTATION_STATUS, PRIORITY_CONFIG } from '../lib/quotations-constants'
import type { Quotation, QuotationItem, Inspection, InspectionFinding } from '@/types/garage'
import { useGarageStore } from '@/stores/garageStore'

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export function QuotationsPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<'list' | 'form'>('list')
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { quotations, isLoadingQuotations, quotationsPagination, fetchQuotations, fetchInspections, inspections, createQuotation } = useGarageStore()
  const searchRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useDebouncedValue(searchInput, 500)

  useEffect(() => {
    fetchInspections()
  }, [fetchInspections])

  useEffect(() => {
    fetchQuotations({ status: statusFilter === 'all' ? undefined : statusFilter, search: debouncedSearch || undefined })
  }, [fetchQuotations, debouncedSearch, statusFilter])

  if (view === 'form') {
    return <QuotationForm onBack={() => setView('list')} inspections={inspections} onCreate={(id) => navigate({ to: '/quotations/$quotationId', params: { quotationId: id } })} />
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
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Quotations</h2>
            <p className='text-muted-foreground'>
              Manage customer quotations and approvals.
            </p>
          </div>
          <Button onClick={() => setView('form')}>
            <IconPlus className='h-4 w-4 mr-2' />
            New Quotation
          </Button>
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <div className='relative flex-1 max-w-sm'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <input
                  ref={searchRef}
                  placeholder='Search by #, vehicle, customer...'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className='pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Filter by status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Statuses</SelectItem>
                  {Object.entries(QUOTATION_STATUS).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation #</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingQuotations ? (
                    <TableRow>
                      <TableCell colSpan={10} className='h-24 text-center'>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : quotations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className='h-24 text-center'>
                        No quotations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    quotations.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell className='font-mono text-sm font-medium'>QT-{q.id.slice(0, 8).toUpperCase()}</TableCell>
                        <TableCell className='text-sm'>{q.vehicleId.slice(0, 8).toUpperCase()}</TableCell>
                        <TableCell className='text-sm'>{q.customerId.slice(0, 8).toUpperCase()}</TableCell>
                        <TableCell>
                          <Badge className={`${QUOTATION_STATUS[q.status]?.color || 'bg-gray-100 text-gray-700'} border-0 text-xs font-medium px-2 py-0.5`}>
                            {QUOTATION_STATUS[q.status]?.label || q.status}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-sm'>${q.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className='text-sm'>${q.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className='text-sm'>${q.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className='text-sm font-semibold'>${q.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        <TableCell className='text-sm'>{new Date(q.validUntil).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='icon' className='h-8 w-8'>
                                <IconDots className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem asChild>
                                <Link to='/quotations/$quotationId' params={{ quotationId: q.id }}>
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}

function QuotationForm({ onBack, inspections, onCreate }: { onBack: () => void; inspections: Inspection[]; onCreate: (id: string) => void }) {
  const [selectedInspectionId, setSelectedInspectionId] = useState('')
  const [items, setItems] = useState<QuotationItem[]>([])
  const [taxRate, setTaxRate] = useState(0.16)
  const [discountPercent, setDiscountPercent] = useState(0)
  const [serviceCharges, setServiceCharges] = useState(25)
  const [validUntil, setValidUntil] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedInspection = inspections.find(i => i.id === selectedInspectionId)

  useEffect(() => {
    if (selectedInspection) {
      const derivedItems: QuotationItem[] = []
      selectedInspection.findings.forEach((finding: InspectionFinding) => {
        if (finding.requiredParts) {
          finding.requiredParts.forEach((part) => {
            derivedItems.push({
              id: `${finding.id}-part-${part.name}`,
              type: 'part',
              description: part.name,
              quantity: part.quantity,
              unitPrice: part.unitPrice,
              total: part.quantity * part.unitPrice,
              findingId: finding.id,
            })
          })
        }
        derivedItems.push({
          id: `${finding.id}-labor`,
          type: 'labor',
          description: `Labor - ${finding.title}`,
          quantity: finding.estimatedLaborHours,
          unitPrice: 50,
          total: finding.estimatedLaborHours * 50,
          findingId: finding.id,
        })
      })
      setItems(derivedItems)
      if (!validUntil) {
        const d = new Date()
        d.setDate(d.getDate() + 30)
        setValidUntil(d.toISOString().split('T')[0])
      }
    }
  }, [selectedInspectionId])

  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * taxRate
  const discountAmount = subtotal * discountPercent
  const totalAmount = subtotal + taxAmount - discountAmount + serviceCharges

  const handleSubmit = async () => {
    if (!selectedInspectionId) return
    setSubmitting(true)
    try {
      const q = await createQuotation({
        vehicleId: selectedInspection?.vehicleId || '',
        customerId: '',
        inspectionId: selectedInspectionId,
        status: 'pending',
        items,
        subtotal,
        taxRate,
        taxAmount,
        discountPercent,
        discountAmount,
        serviceCharges,
        totalAmount,
        validUntil: new Date(validUntil).toISOString(),
        notes: notes || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      onCreate(q.id)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={onBack}>
          <IconDots className='h-4 w-4 rotate-90' />
        </Button>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>New Quotation</h2>
          <p className='text-muted-foreground text-sm'>Create a new quotation from inspection findings.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quotation Details</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label>Inspection</Label>
              <Select value={selectedInspectionId} onValueChange={setSelectedInspectionId}>
                <SelectTrigger>
                  <SelectValue placeholder='Select inspection' />
                </SelectTrigger>
                <SelectContent>
                  {inspections.map((ins) => (
                    <SelectItem key={ins.id} value={ins.id}>
                      INS-{ins.id.slice(0, 8).toUpperCase()} - {ins.findings.length} findings
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>Valid Until</Label>
              <Input type='date' value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
            </div>
          </div>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label>Tax Rate (%)</Label>
              <Input type='number' step='0.01' value={Math.round(taxRate * 100)} onChange={(e) => setTaxRate(Number(e.target.value) / 100)} />
            </div>
            <div className='space-y-2'>
              <Label>Discount (%)</Label>
              <Input type='number' step='0.01' value={Math.round(discountPercent * 100)} onChange={(e) => setDiscountPercent(Number(e.target.value) / 100)} />
            </div>
            <div className='space-y-2'>
              <Label>Service Charges ($)</Label>
              <Input type='number' step='0.01' value={serviceCharges} onChange={(e) => setServiceCharges(Number(e.target.value))} />
            </div>
          </div>
          <div className='space-y-2'>
            <Label>Notes</Label>
            <Textarea placeholder='Additional notes...' value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {items.length > 0 && (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge className={`${item.type === 'part' ? 'bg-blue-100 text-blue-700' : item.type === 'labor' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'} border-0 text-xs font-medium px-2 py-0.5`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-sm'>{item.description}</TableCell>
                    <TableCell className='text-sm'>{item.quantity}</TableCell>
                    <TableCell className='text-sm'>${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className='text-sm font-medium'>${item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between text-sm'><span className='text-muted-foreground'>Subtotal</span><span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              <div className='flex justify-between text-sm'><span className='text-muted-foreground'>Tax ({Math.round(taxRate * 100)}%)</span><span>${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              <div className='flex justify-between text-sm'><span className='text-muted-foreground'>Discount ({Math.round(discountPercent * 100)}%)</span><span>-${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              <div className='flex justify-between text-sm'><span className='text-muted-foreground'>Service Charges</span><span>${serviceCharges.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
              <Separator />
              <div className='flex justify-between text-lg font-bold'><span>TOTAL</span><span>${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onBack}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!selectedInspectionId || items.length === 0 || submitting}>
          {submitting ? 'Saving...' : 'Save Quotation'}
        </Button>
      </div>
    </div>
  )
}
