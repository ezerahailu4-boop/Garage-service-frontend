import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Link, useNavigate } from '@tanstack/react-router'
import { QUOTATION_STATUS } from '../lib/quotations-constants'
import type { Quotation } from '@/types/garage'
import { useGarageStore } from '@/stores/garageStore'

const columns = [
  {
    accessorKey: 'quotationNumber',
    header: 'Quotation #',
    cell: ({ row }: { row: { original: Quotation } }) => (
      <span className='font-mono text-sm font-medium'>
        QT-{row.original.id.slice(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    accessorKey: 'vehicle',
    header: 'Vehicle',
    cell: ({ row }: { row: { original: Quotation } }) => (
      <span>
        {row.original.vehicleId.slice(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    accessorKey: 'customerId',
    header: 'Customer',
    cell: ({ row }: { row: { original: Quotation } }) => (
      <span className='text-sm'>
        {row.original.customerId.slice(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: { original: Quotation } }) => {
      const status = QUOTATION_STATUS[row.original.status] || { label: row.original.status, color: 'bg-gray-100 text-gray-700' }
      return <Badge className={`${status.color} border-0 text-xs font-medium px-2 py-0.5`}>{status.label}</Badge>
    },
  },
  {
    accessorKey: 'subtotal',
    header: 'Subtotal',
    cell: ({ row }: { row: { original: Quotation } }) => (
      <span className='text-sm'>${row.original.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    ),
  },
  {
    accessorKey: 'taxAmount',
    header: 'Tax',
    cell: ({ row }: { row: { original: Quotation } }) => (
      <span className='text-sm'>${row.original.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    ),
  },
  {
    accessorKey: 'discountAmount',
    header: 'Discount',
    cell: ({ row }: { row: { original: Quotation } }) => (
      <span className='text-sm'>${row.original.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: ({ row }: { row: { original: Quotation } }) => (
      <span className='text-sm font-semibold'>${row.original.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
    ),
  },
  {
    accessorKey: 'validUntil',
    header: 'Valid Until',
    cell: ({ row }: { row: { original: Quotation } }) => (
      <span className='text-sm'>{new Date(row.original.validUntil).toLocaleDateString()}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: { row: { original: Quotation } }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='h-8 w-8'>
            <IconDots className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem asChild>
            <Link to='/quotations/$quotationId' params={{ quotationId: row.original.id }}>
              View Details
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function QuotationsIndex() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { quotations, isLoadingQuotations, quotationsPagination, fetchQuotations } = useGarageStore()
  const searchRef = useRef<HTMLInputElement>(null)

  const debouncedSearch = useDebouncedValue(searchInput, 500)

  useEffect(() => {
    fetchQuotations({ status: statusFilter === 'all' ? undefined : statusFilter, search: debouncedSearch || undefined })
  }, [fetchQuotations, debouncedSearch, statusFilter])

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
          <Button onClick={() => navigate({ to: '/quotations/new' })}>New Quotation</Button>
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
                    {columns.map((col) => (
                      <TableHead key={col.accessorKey || col.id}>{col.header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingQuotations ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className='h-24 text-center'>
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : quotations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className='h-24 text-center'>
                        No quotations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    quotations.map((quotation) => (
                      <TableRow key={quotation.id}>
                        {columns.map((col) => (
                          <TableCell key={col.accessorKey || col.id}>
                            {col.cell({ row: { original: quotation } })}
                          </TableCell>
                        ))}
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
