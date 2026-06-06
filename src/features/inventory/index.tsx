import { useState, useEffect } from 'react'
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
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

const STOCK_COLORS: Record<string, string> = {
  in_stock: 'bg-green-100 text-green-700',
  low_stock: 'bg-yellow-100 text-yellow-700',
  out_of_stock: 'bg-red-100 text-red-700',
  on_order: 'bg-blue-100 text-blue-700',
}

export function InventoryPage() {
  const { spareParts, isLoadingInventory, sparePartsPagination, fetchSpareParts, lowStockParts, fetchLowStockParts } = useGarageStore()
  const [searchInput, setSearchInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    fetchSpareParts()
    fetchLowStockParts()
  }, [fetchSpareParts, fetchLowStockParts])

  const filtered = spareParts.filter((p) => {
    const matchesSearch = !searchInput ||
      p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(searchInput.toLowerCase())
    const matchesStatus = !statusFilter || p.status === statusFilter
    const matchesCategory = !categoryFilter || p.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = Array.from(new Set(spareParts.map(p => p.category)))

  if (isLoadingInventory) {
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
          <Skeleton className='h-8 w-32 mb-6' />
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableHead key={i}><Skeleton className='h-4 w-20' /></TableHead>
                ))}
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className='h-4 w-full' /></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
            <h2 className='text-2xl font-bold tracking-tight'>Inventory</h2>
            <p className='text-muted-foreground'>Manage spare parts and stock levels.</p>
          </div>
        </div>

        {lowStockParts.length > 0 && (
          <Card className='mb-6 border-yellow-200 bg-yellow-50/50'>
            <CardHeader>
              <CardTitle className='text-yellow-800'>⚠ Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-yellow-700'>{lowStockParts.length} items are below minimum stock levels</p>
            </CardContent>
          </Card>
        )}

        <div className='flex items-center gap-2 mb-4'>
          <div className='relative flex-1 max-w-sm'>
            <input
              type='search'
              placeholder='Search by name, part number...'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className='flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='flex h-9 items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring'
          >
            <option value=''>All Status</option>
            <option value='in_stock'>In Stock</option>
            <option value='low_stock'>Low Stock</option>
            <option value='out_of_stock'>Out of Stock</option>
            <option value='on_order'>On Order</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className='flex h-9 items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring'
          >
            <option value=''>All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part #</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='h-24 text-center'>
                    No parts found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className='font-mono text-sm'>{part.partNumber}</TableCell>
                    <TableCell className='font-medium'>{part.name}</TableCell>
                    <TableCell className='text-sm capitalize'>{part.category.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      <span className={part.stockQuantity <= part.minStockLevel ? 'text-red-600 font-semibold' : ''}>
                        {part.stockQuantity}
                      </span>
                    </TableCell>
                    <TableCell className='text-sm'>{part.minStockLevel}</TableCell>
                    <TableCell className='text-sm'>${part.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={`${STOCK_COLORS[part.status] || 'bg-gray-100 text-gray-700'} border-0 text-xs font-medium px-2 py-0.5`}>
                        {part.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Main>
    </>
  )
}

export { InventoryPage as default }
