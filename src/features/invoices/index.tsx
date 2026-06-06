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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGarageStore } from '@/stores/garageStore'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { INVOICE_STATUS } from '../quotations/lib/quotations-constants'

export function InvoicesPage() {
  const { invoices, isLoadingInvoices, invoicesPagination, fetchInvoices } = useGarageStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const filtered = invoices.filter((inv) => {
    const matchesSearch = !searchQuery ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !statusFilter || inv.status === statusFilter
    return matchesSearch && matchesStatus
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
        <div className='mb-2'>
          <h2 className='text-2xl font-bold tracking-tight'>Invoices</h2>
          <p className='text-muted-foreground'>Manage invoices and payments.</p>
        </div>

        <div className='flex items-center gap-2 mb-4'>
          <div className='relative flex-1 max-w-sm'>
            <input
              type='search'
              placeholder='Search by # or customer...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='flex h-9 items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring'
          >
            <option value=''>All Status</option>
            {Object.entries(INVOICE_STATUS).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='h-24 text-center'>
                    No invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => {
                  const statusConfig = INVOICE_STATUS[inv.status] || { label: inv.status, color: 'bg-gray-100 text-gray-700' }
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className='font-mono text-sm font-medium'>
                        <Link to='/invoices/$invoiceId' params={{ invoiceId: inv.id }} className='hover:underline'>
                          {inv.invoiceNumber}
                        </Link>
                      </TableCell>
                      <TableCell className='text-sm'>{inv.customerId.slice(0, 8).toUpperCase()}</TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig.color} border-0 text-xs font-medium px-2 py-0.5`}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-sm font-medium'>
                        ${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className='text-sm text-green-600'>
                        ${inv.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className='text-sm text-red-600'>
                        ${inv.dueAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className='text-sm'>{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Main>
    </>
  )
}

export { InvoicesPage as default }
