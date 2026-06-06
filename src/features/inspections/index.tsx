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
import { IconPlus, IconArrowLeft } from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useReactTable, getCoreRowModel, createColumnHelper, flexRender } from '@tanstack/react-table'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { useGarageStore } from '@/stores/garageStore'
import type { Inspection, InspectionCategory, SeverityLevel, Vehicle, User } from '@/types/garage'

const CATEGORY_LABELS: Record<InspectionCategory, string> = {
  engine: 'Engine',
  transmission: 'Transmission',
  brake_system: 'Brake System',
  suspension: 'Suspension',
  steering: 'Steering',
  electrical: 'Electrical',
  ac_system: 'AC System',
  cooling_system: 'Cooling System',
  tires: 'Tires',
  body_work: 'Body Work',
}

const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; color: string; dotColor: string }> = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200', dotColor: 'bg-red-500' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200', dotColor: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dotColor: 'bg-yellow-500' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
}

const INSPECTIONS_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function InspectionsPage() {
  const navigate = useNavigate()
  const { inspections, isLoadingInspections, fetchInspections, inspectionsPagination, vehicles, users } = useGarageStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  useEffect(() => {
    fetchInspections({ page: 1, limit: 10 })
  }, [fetchInspections])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInspections({ search: searchQuery, status: selectedStatus || undefined, page: 1, limit: 10 })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedStatus, fetchInspections])

  const getVehicle = (vehicleId: string): Vehicle | undefined => vehicles.find(v => v.id === vehicleId)
  const getInspector = (inspectorId: string): User | undefined => users.find(u => u.id === inspectorId)

  const columnHelper = createColumnHelper<Inspection>()

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: ({ getValue }) => {
        const id = getValue() as string
        return <span className='font-mono text-sm'>INS-{id.slice(0, 8).toUpperCase()}</span>
      },
      enableSorting: false,
    }),
    columnHelper.accessor('vehicleId', {
      header: 'Vehicle',
      cell: ({ getValue }) => {
        const vehicle = getVehicle(getValue() as string)
        return vehicle ? (
          <div>
            <p className='font-medium'>{vehicle.make} {vehicle.model}</p>
            <p className='text-xs text-muted-foreground'>{vehicle.licensePlate}</p>
          </div>
        ) : '-'
      },
      enableSorting: false,
    }),
    columnHelper.accessor('inspectorId', {
      header: 'Inspector',
      cell: ({ getValue }) => {
        const inspector = getInspector(getValue() as string)
        return inspector ? `${inspector.firstName} ${inspector.lastName}` : '-'
      },
      enableSorting: false,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue() as string
        const config = STATUS_CONFIG[status] || { label: status, color: 'bg-gray-100 text-gray-700' }
        return (
          <Badge className={`${config.color} border-0 text-xs font-medium px-2 py-0.5`}>
            {config.label}
          </Badge>
        )
      },
      enableSorting: false,
    }),
    columnHelper.accessor('findings', {
      header: 'Findings',
      cell: ({ getValue }) => {
        const findings = getValue() as Inspection['findings']
        return <span className='text-sm'>{findings.length}</span>
      },
      enableSorting: false,
    }),
    columnHelper.accessor('overallCondition', {
      header: 'Condition',
      cell: ({ getValue }) => {
        const condition = getValue() as string
        const config = {
          excellent: { label: 'Excellent', color: 'bg-green-100 text-green-700' },
          good: { label: 'Good', color: 'bg-blue-100 text-blue-700' },
          fair: { label: 'Fair', color: 'bg-yellow-100 text-yellow-700' },
          poor: { label: 'Poor', color: 'bg-red-100 text-red-700' },
        }[condition] || { label: condition, color: 'bg-gray-100 text-gray-700' }
        return (
          <Badge className={`${config.color} border-0 text-xs font-medium px-2 py-0.5`}>
            {config.label}
          </Badge>
        )
      },
      enableSorting: false,
    }),
    columnHelper.accessor('startedAt', {
      header: 'Started At',
      cell: ({ getValue }) => {
        const date = getValue() as string
        return <span className='text-sm'>{new Date(date).toLocaleDateString()}</span>
      },
      enableSorting: false,
    }),
    columnHelper.accessor('id', {
      header: 'Actions',
      cell: ({ getValue }) => {
        const id = getValue() as string
        return (
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate({ to: '/inspections/$inspectionId', params: { inspectionId: id } })}
          >
            View
          </Button>
        )
      },
      enableSorting: false,
    }),
  ], [getVehicle, getInspector, navigate])

  const table = useReactTable({
    data: inspections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      pagination: {
        pageIndex: inspectionsPagination.page - 1,
        pageSize: inspectionsPagination.limit,
      },
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
            <h2 className='text-2xl font-bold tracking-tight'>Inspections</h2>
            <p className='text-muted-foreground'>
              Manage vehicle inspections and findings.
            </p>
          </div>
          <Button onClick={() => navigate({ to: '/inspections/new' })}>
            <IconPlus className='mr-2 h-4 w-4' />
            New Inspection
          </Button>
        </div>

        <div className='flex items-center gap-4 mb-4'>
          <div className='relative flex-1 max-w-sm'>
            <input
              type='search'
              placeholder='Search inspections...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className='flex h-9 items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring'
          >
            <option value=''>All Status</option>
            {INSPECTIONS_STATUSES.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {isLoadingInspections ? (
          <div className='space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='h-16 bg-slate-200 animate-pulse rounded-md' />
            ))}
          </div>
        ) : (
          <div className='overflow-hidden rounded-md border'>
            <table className='w-full text-sm'>
              <thead className='bg-muted/50'>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} className='h-10 px-2 text-left font-medium'>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className='border-b hover:bg-muted/50'>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className='p-2 align-middle'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className='h-24 text-center'>
                      No inspections found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isLoadingInspections && inspectionsPagination.totalPages > 1 && (
          <div className='flex items-center justify-between mt-4'>
            <div className='text-sm text-muted-foreground'>
              Page {inspectionsPagination.page} of {inspectionsPagination.totalPages}
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => fetchInspections({ page: inspectionsPagination.page - 1, limit: 10 })}
                disabled={!inspectionsPagination.hasPrev}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => fetchInspections({ page: inspectionsPagination.page + 1, limit: 10 })}
                disabled={!inspectionsPagination.hasNext}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}

export { InspectionsPage }