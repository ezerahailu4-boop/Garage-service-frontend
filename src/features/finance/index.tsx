import { IconCoin, IconArrowUpRight } from '@tabler/icons-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockRevenueData } from '@/data/mock'

const mockInvoices = [
  { id: 'INV-2025-089', customer: 'Yohannes Alemu', amount: 9800, status: 'paid', date: '2025-06-05' },
  { id: 'INV-2025-090', customer: 'Sara Tadesse', amount: 14200, status: 'pending', date: '2025-06-05' },
  { id: 'INV-2025-088', customer: 'Abebe Girma', amount: 28500, status: 'paid', date: '2025-06-04' },
  { id: 'INV-2025-087', customer: 'Dawit Bekele', amount: 12957, status: 'pending', date: '2025-06-04' },
  { id: 'INV-2025-086', customer: 'Tigist Haile', amount: 7300, status: 'draft', date: '2025-06-03' },
]

export default function Finance() {
  const totalReceived = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = mockInvoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconCoin className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Finance</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
          <p className="text-muted-foreground text-sm">Revenue, invoices and payments</p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-5">
              <p className="text-muted-foreground text-sm">Monthly Revenue</p>
              <p className="mt-1 text-2xl font-bold">ETB 486,200</p>
              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-600">
                <IconArrowUpRight className="h-3 w-3" />
                +8.7% vs last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-muted-foreground text-sm">Collected (This Month)</p>
              <p className="mt-1 text-2xl font-bold">ETB {totalReceived.toLocaleString()}</p>
              <div className="mt-1 text-xs text-emerald-600 font-medium">2 invoices paid</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <p className="text-muted-foreground text-sm">Outstanding</p>
              <p className="mt-1 text-2xl font-bold">ETB {totalPending.toLocaleString()}</p>
              <div className="mt-1 text-xs text-amber-600 font-medium">2 pending invoices</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Monthly Revenue</CardTitle>
              <CardDescription>Jan – Jun 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mockRevenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => [`ETB ${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {mockInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium">{inv.id}</p>
                        <p className="text-muted-foreground text-xs">{inv.customer}</p>
                      </td>
                      <td className="px-4 py-3 tabular-nums font-semibold">
                        ETB {inv.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`text-xs border-0 ${
                            inv.status === 'paid'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950'
                              : inv.status === 'pending'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                          }`}
                        >
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
