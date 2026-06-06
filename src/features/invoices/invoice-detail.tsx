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
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, useParams } from '@tanstack/react-router'
import { useGarageStore } from '@/stores/garageStore'
import { INVOICE_STATUS, QUOTATION_STATUS } from '../quotations/lib/quotations-constants'

export function InvoiceDetail() {
  const { invoiceId } = useParams({ from: '/_authenticated/invoices/$invoiceId' })
  const { invoices, fetchInvoices } = useGarageStore()

  const invoice = invoices.find(inv => inv.id === invoiceId)

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  if (!invoice) {
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
            <p className='text-muted-foreground'>Loading invoice...</p>
          </div>
        </Main>
      </>
    )
  }

  const statusConfig = INVOICE_STATUS[invoice.status] || { label: invoice.status, color: 'bg-gray-100 text-gray-700' }

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
            <Link to='/invoices'>
              <IconArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>{invoice.invoiceNumber}</h1>
            <p className='text-muted-foreground text-sm'>
              Created {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className='ml-auto'>
            <Badge className={`${statusConfig.color} border-0 text-xs font-medium px-3 py-1`}>
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className='text-sm'>{item.description}</TableCell>
                      <TableCell className='text-sm'>{item.quantity}</TableCell>
                      <TableCell className='text-sm'>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className='text-sm font-medium'>${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>${invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Tax</span>
                  <span>${invoice.taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Discount</span>
                  <span>-${invoice.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className='flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span>${invoice.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className='flex justify-between text-sm pt-2 border-t'>
                  <span className='text-muted-foreground'>Paid</span>
                  <span className='text-green-600'>${invoice.paidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Due</span>
                  <span className='text-red-600'>${invoice.dueAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {(invoice.payments || []).length === 0 ? (
                  <p className='text-sm text-muted-foreground text-center py-4'>No payments recorded</p>
                ) : (
                  <div className='space-y-3'>
                    {(invoice.payments || []).map((payment) => (
                      <div key={payment.id} className='flex justify-between items-center p-2 rounded border'>
                        <div>
                          <p className='text-sm font-medium'>${payment.amount.toFixed(2)}</p>
                          <p className='text-xs text-muted-foreground'>{payment.method}</p>
                        </div>
                        <Badge className='bg-green-100 text-green-700 border-0 text-xs'>
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}

export { InvoiceDetail as default }
