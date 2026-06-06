import React, { useEffect, useState } from 'react'
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { IconDots, IconEye, IconTrash, IconPlus, IconUsers, IconUserCheck, IconCalendar, IconCurrencyDollar } from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useDebounce } from '@/hooks/use-debounce'
import type { Customer } from '@/types/garage'
import { useGarageStore } from '@/stores/garageStore'
import { CustomerForm } from './customer-form'

const formSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone required'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof formSchema>

const columnHelper = createColumnHelper<Customer>()

const columns = [
  columnHelper.accessor('firstName', {
    header: 'Name',
    cell: ({ row }) => (
      <span className='font-medium'>
        {row.original.firstName} {row.original.lastName}
      </span>
    ),
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: ({ row }) => <span className='text-sm'>{row.original.email}</span>,
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    cell: ({ row }) => <span className='text-sm'>{row.original.phone}</span>,
  }),
  columnHelper.accessor('totalSpent', {
    header: 'Total Spent',
    cell: ({ row }) => (
      <span className='text-sm font-medium'>
        ${row.original.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    ),
  }),
  columnHelper.accessor('visitsCount', {
    header: 'Visits',
    cell: ({ row }) => <span className='text-sm'>{row.original.visitsCount}</span>,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Status',
    cell: ({ row }) => {
      const isActive = true
      return (
        <Badge className={isActive ? 'bg-green-100 text-green-700 border-0' : 'bg-red-100 text-red-700 border-0'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='sm' asChild>
          <Link to='/customers/$customerId' params={{ customerId: row.original.id }}>
            <IconEye className='h-4 w-4' />
            View
          </Link>
        </Button>
        <Button variant='ghost' size='sm'>
          <IconTrash className='h-4 w-4' />
        </Button>
      </div>
    ),
  }),
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function CustomersPage() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  
  const { customers, isLoadingCustomers, customersPagination, fetchCustomers, createCustomer } = useGarageStore()
  const debouncedSearch = useDebounce(searchInput, 500)

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    fetchCustomers({ search: debouncedSearch || undefined })
  }, [fetchCustomers, debouncedSearch])

  const handleAddCustomer = async (data: CustomerFormValues) => {
    setIsSubmitting(true)
    try {
      await createCustomer(data)
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to create customer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalCustomers = customersPagination.total
  const activeCustomers = customers.filter(c => c.visitsCount > 0).length
  const newThisMonth = customers.filter(c => {
    const created = new Date(c.createdAt)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  }).length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)

  if (isLoadingCustomers) {
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
              <Skeleton className='h-8 w-32' />
              <Skeleton className='h-4 w-48 mt-2' />
            </div>
            <Skeleton className='h-9 w-24' />
          </div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className='pb-2'>
                  <Skeleton className='h-4 w-20' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-8 w-16 mb-1' />
                  <Skeleton className='h-3 w-24' />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-9 flex-1 max-w-sm' />
              <Skeleton className='h-9 w-[180px]' />
            </div>
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <TableHead key={i}><Skeleton className='h-4 w-20' /></TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className='h-4 w-full' /></TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Main>
      </>
    )
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
            <h2 className='text-2xl font-bold tracking-tight'>Customers</h2>
            <p className='text-muted-foreground'>
              Manage customer information and view service history.
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconPlus className='h-4 w-4 mr-2' />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Enter customer details to add them to the system.
                </DialogDescription>
              </DialogHeader>
              <CustomerForm
                onSubmit={handleAddCustomer}
                onCancel={() => setIsAddDialogOpen(false)}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Total Customers</CardTitle>
              <IconUsers className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatNumber(totalCustomers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Active Customers</CardTitle>
              <IconUserCheck className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatNumber(activeCustomers)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>New This Month</CardTitle>
              <IconCalendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatNumber(newThisMonth)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between pb-2'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>Total Revenue</CardTitle>
              <IconCurrencyDollar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          <div className='flex items-center gap-2'>
            <div className='relative flex-1 max-w-sm'>
              <Input
                placeholder='Search by name, email, phone...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className='h-9'
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Customers</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableHead key={cell.id}>
                        {flexRender(cell.column.columnDef.header, cell.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                      No customers found.
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

          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              Showing {customersPagination.total > 0 ? (customersPagination.page - 1) * customersPagination.limit + 1 : 0}-
              {Math.min(customersPagination.page * customersPagination.limit, customersPagination.total)} of {customersPagination.total} customers
            </p>
          </div>
        </div>
      </Main>
    </>
  )
}