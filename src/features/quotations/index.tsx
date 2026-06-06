import {
  IconFileInvoice,
  IconCheck,
  IconX,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { mockQuotations, type ApprovalStatus } from '@/data/mock'

const approvalConfig: Record<ApprovalStatus, { label: string; icon: React.ReactNode; className: string }> = {
  pending: {
    label: 'Pending',
    icon: <IconClock className="h-4 w-4" />,
    className: 'bg-amber-50 text-amber-600 dark:bg-amber-950',
  },
  approved: {
    label: 'Approved',
    icon: <IconCheck className="h-4 w-4" />,
    className: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950',
  },
  partially_approved: {
    label: 'Partial',
    icon: <IconAlertCircle className="h-4 w-4" />,
    className: 'bg-blue-50 text-blue-600 dark:bg-blue-950',
  },
  rejected: {
    label: 'Rejected',
    icon: <IconX className="h-4 w-4" />,
    className: 'bg-red-50 text-red-600 dark:bg-red-950',
  },
}

export default function Quotations() {
  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconFileInvoice className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Quotations</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Quotations</h1>
          <p className="text-muted-foreground text-sm">{mockQuotations.length} quotations generated</p>
        </div>

        <div className="space-y-4">
          {mockQuotations.map((q) => {
            const ac = approvalConfig[q.approvalStatus]
            return (
              <Card key={q.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">Quote #{q.id.toUpperCase()}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-0.5">
                        {q.customerName} · {q.vehiclePlate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${ac.className}`}>
                        {ac.icon}
                        {ac.label}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Line Items */}
                  <div className="space-y-2">
                    {q.items.map((item) => (
                      <div key={item.findingId} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <div className="text-muted-foreground mt-0.5 flex gap-4 text-xs">
                            <span>Parts: ETB {item.partsCost.toLocaleString()}</span>
                            <span>Labor: ETB {item.laborCost.toLocaleString()}</span>
                          </div>
                        </div>
                        <p className="font-semibold text-sm">ETB {(item.partsCost + item.laborCost).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Totals */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>ETB {q.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax (15%)</span>
                      <span>ETB {q.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service Charge</span>
                      <span>ETB {q.serviceCharge.toLocaleString()}</span>
                    </div>
                    {q.discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span>- ETB {q.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span>ETB {q.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {q.approvalStatus === 'pending' && (
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                        <IconCheck className="h-3.5 w-3.5" />
                        Send to Customer
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        Edit Quote
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Main>
    </>
  )
}
