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
import { useGarageStore } from '@/stores/garageStore'

function Stars({ rating }: { rating: number }) {
  return (
    <span className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}>★</span>
      ))}
      <span className='text-xs text-muted-foreground ml-1'>{rating.toFixed(1)}</span>
    </span>
  )
}

export function SuppliersPage() {
  const { suppliers, isLoadingTechnicians, fetchSuppliers } = useGarageStore()

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
          <h2 className='text-2xl font-bold tracking-tight'>Suppliers</h2>
          <p className='text-muted-foreground'>Manage spare parts suppliers.</p>
        </div>

        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='h-24 text-center'>
                    No suppliers found.
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className='font-medium'>{supplier.name}</TableCell>
                    <TableCell className='text-sm'>{supplier.contactPerson}</TableCell>
                    <TableCell className='text-sm'>{supplier.email}</TableCell>
                    <TableCell className='text-sm'>{supplier.phone}</TableCell>
                    <TableCell className='text-sm'>{supplier.paymentTerms}</TableCell>
                    <TableCell><Stars rating={supplier.rating} /></TableCell>
                    <TableCell>
                      <Badge className={supplier.isActive ? 'bg-green-100 text-green-700 border-0' : 'bg-red-100 text-red-700 border-0'}>
                        {supplier.isActive ? 'Active' : 'Inactive'}
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

export { SuppliersPage as default }
