import { IconChartBar } from '@tabler/icons-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { mockRevenueData, mockTechnicians } from '@/data/mock'

const techPerfData = mockTechnicians.map((t) => ({
  name: t.name.split(' ')[0],
  efficiency: t.efficiency,
  completed: t.completedToday,
  rating: t.rating * 20,
}))

const inspectionTrend = [
  { month: 'Jan', inspections: 38, completed: 35 },
  { month: 'Feb', inspections: 29, completed: 27 },
  { month: 'Mar', inspections: 48, completed: 44 },
  { month: 'Apr', inspections: 42, completed: 39 },
  { month: 'May', inspections: 55, completed: 52 },
  { month: 'Jun', inspections: 51, completed: 48 },
]

export default function Reports() {
  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconChartBar className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Reports</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground text-sm">Business intelligence for Birhan Garage</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue in ETB</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mockRevenueData}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: any) => [`ETB ${v.toLocaleString()}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Inspection Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Inspection Volume</CardTitle>
              <CardDescription>Requested vs completed inspections</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={inspectionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="inspections" name="Requested" fill="#94a3b8" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="completed" name="Completed" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Technician Performance */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Technician Performance</CardTitle>
              <CardDescription>Efficiency and productivity metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={techPerfData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={60} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="efficiency" name="Efficiency %" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="rating" name="Rating (x20)" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
