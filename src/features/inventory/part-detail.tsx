import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
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
import { Badge } from '@/components/ui/badge'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, useParams } from '@tanstack/react-router'
import { useGarageStore } from '@/stores/garageStore'

const STOCK_COLORS: Record<string, string> = {
  in_stock: 'bg-green-100 text-green-700',
  low_stock: 'bg-yellow-100 text-yellow-700',
  out_of_stock: 'bg-red-100 text-red-700',
  on_order: 'bg-blue-100 text-blue-700',
}

export function PartDetail() {
  const { partId } = useParams({ from: '/_authenticated/inventory/$partId' })
  const { spareParts, fetchSparePart } = useGarageStore()

  const part = spareParts.find(p => p.id === partId)

  if (!part) {
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
            <p className='text-muted-foreground'>Loading part...</p>
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
        <div className='flex items-center gap-4 mb-6'>
          <Button variant='ghost' size='icon' asChild>
            <Link to='/inventory'>
              <IconArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>{part.name}</h1>
            <p className='text-muted-foreground text-sm'>Part #{part.partNumber}</p>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>Part Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <p className='text-xs text-muted-foreground'>Name</p>
                <p className='text-sm font-medium'>{part.name}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Part Number</p>
                <p className='text-sm font-mono'>{part.partNumber}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Category</p>
                <p className='text-sm font-medium capitalize'>{part.category.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Brand</p>
                <p className='text-sm font-medium'>{part.brand || 'N/A'}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Location</p>
                <p className='text-sm font-medium'>{part.location || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div>
                <p className='text-xs text-muted-foreground'>Current Stock</p>
                <p className='text-2xl font-bold'>{part.stockQuantity}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Min Stock Level</p>
                <p className='text-sm font-medium'>{part.minStockLevel}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Max Stock Level</p>
                <p className='text-sm font-medium'>{part.maxStockLevel}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Status</p>
                <Badge className={`${STOCK_COLORS[part.status] || 'bg-gray-100 text-gray-700'} border-0 text-xs font-medium px-2 py-0.5`}>
                  {part.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Pricing</p>
                <p className='text-sm'>Cost: ${part.costPrice.toFixed(2)}</p>
                <p className='text-sm font-medium'>Sell: ${part.unitPrice.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compatible Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              {part.compatibleVehicles.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No specific vehicles listed</p>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {part.compatibleVehicles.map((v) => (
                    <Badge key={v} variant='outline' className='text-xs'>{v}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

export { PartDetail as default }
