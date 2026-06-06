import { useState, useMemo, useEffect, useRef } from 'react'
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnFiltersState, type SortingState, type VisibilityState } from '@tanstack/react-table'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { IconDots, IconPlus } from '@tabler/icons-react'
import { VEHICLE_STATUS } from './lib/vehicle-constants'
import { useGarageStore } from '@/stores/garageStore'
import { useDebounce } from '@/hooks/use-debounce'
import { VehicleForm } from './vehicle-form'
import { Link, useNavigate } from '@tanstack/react-router'
import type { Vehicle } from '@/types/garage'

const columnHelper = createColumnHelper<Vehicle>()

const columns = [
  columnHelper.accessor('make', {
    header: 'Make',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('make')}</div>,
  }),
  columnHelper.accessor('model', {
    header: 'Model',
    cell: ({ row }) => <div>{row.getValue('model')}</div>,
  }),
  columnHelper.accessor('year', {
    header: 'Year',
    cell: ({ row }) => <div>{row.getValue('year')}</div>,
  }),
  columnHelper.accessor('vin', {
    header: 'VIN',
    cell: ({ row }) => <div className='font-mono text-sm'>{row.getValue('vin')}</div>,
  }),
  columnHelper.accessor('licensePlate', {
    header: 'License Plate',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('licensePlate')}</div>,
  }),
  columnHelper.accessor('mileage', {
    header: 'Mileage',
    cell: ({ row }) => <div>{row.getValue('mileage').toLocaleString()} mi</div>,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ row }) => {
      const status = VEHICLE_STATUS[row.getValue('status')]
      return (
        <Badge className={`${status?.color || 'bg-gray-100 text-gray-700'} border-0 text-xs font-medium px-2 py-0.5`}>
          {status?.label || row.getValue('status')}
        </Badge>
      )
    },
  }),
  columnHelper.accessor('customerId', {
    header: 'Customer',
    cell: ({ row, table }) => {
      const customers = (table.options.meta as { customers?: { id: string; firstName: string; lastName: string }[] })?.customers || []
      const customer = customers.find(c => c.id === row.getValue('customerId'))
      return <div>{customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'}</div>
    },
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Link to='/vehicles/$vehicleId' params={{ vehicleId: row.original.id }}>
        <Button variant='ghost' size='sm'>
          View
        </Button>
      </Link>
    ),
  }),
]

export default function VehiclesPage() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const { vehicles, isLoadingVehicles, vehiclesPagination, fetchVehicles, customers, fetchCustomers } = useGarageStore()

  const debouncedSearch = useDebounce(searchInput, 500)

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  useEffect(() => {
    fetchVehicles({ status: statusFilter === 'all' ? undefined : statusFilter as Vehicle['status'], search: debouncedSearch || undefined })
  }, [fetchVehicles, debouncedSearch, statusFilter])

  const table = useReactTable({
    data: vehicles,
    columns,
    state: {
      sorting: [],
      columnVisibility: {},
      rowSelection: {},
      columnFilters: [],
    },
    enableRowSelection: false,
    enableSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      customers,
    },
  })

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
            <h2 className='text-2xl font-bold tracking-tight'>Vehicles</h2>
            <p className='text-muted-foreground'>
              Manage vehicle registrations and track repair status.
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)}>
            <IconPlus className='h-4 w-4 mr-2' />
            Register Vehicle
          </Button>
        </div>

        <div className='flex items-center gap-2 mb-4'>
          <div className='relative flex-1 max-w-sm'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <input
              ref={searchRef}
              placeholder='Search by make, model, VIN, license plate...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className='pl-8 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm'
          >
            <option value='all'>All Statuses</option>
            {Object.entries(VEHICLE_STATUS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoadingVehicles ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : vehicles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No vehicles found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {vehiclesPagination.totalPages > 1 && (
          <div className='flex items-center justify-between py-4'>
            <div className='text-sm text-muted-foreground'>
              Page {vehiclesPagination.page} of {vehiclesPagination.totalPages}
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => fetchVehicles({ page: vehiclesPagination.page - 1 })}
                disabled={!vehiclesPagination.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => fetchVehicles({ page: vehiclesPagination.page + 1 })}
                disabled={!vehiclesPagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Main>

      <VehicleForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customers={customers}
      />
    </>
  )
}

export { VehiclesPage }