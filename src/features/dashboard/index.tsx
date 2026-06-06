import {
  IconCar,
  IconTool,
  IconClipboardList,
  IconCoin,
  IconPackage,
  IconAlertTriangle,
  IconCheck,
  IconSend,
  IconCircleCheck,
  IconArrowUpRight,
  IconArrowDownRight,
  IconClockHour4,
  IconTrendingUp,
} from '@tabler/icons-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  mockDashboardStats,
  mockRevenueData,
  mockJobStatusData,
  mockActivityFeed,
  mockTechnicians,
  mockWorkOrders,
  workOrderStatusConfig,
} from '@/data/mock'

const activityIcons: Record<string, React.ReactNode> = {
  check: <IconCheck className="h-3.5 w-3.5" />,
  send: <IconSend className="h-3.5 w-3.5" />,
  package: <IconPackage className="h-3.5 w-3.5" />,
  wrench: <IconTool className="h-3.5 w-3.5" />,
  car: <IconCar className="h-3.5 w-3.5" />,
  'check-circle': <IconCircleCheck className="h-3.5 w-3.5" />,
}

const activityColors: Record<string, string> = {
  inspection_completed: 'bg-emerald-500',
  quotation_sent: 'bg-blue-500',
  parts_ordered: 'bg-amber-500',
  work_order_started: 'bg-orange-500',
  vehicle_registered: 'bg-slate-500',
  invoice_paid: 'bg-green-500',
}

function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconColor,
  prefix = '',
  suffix = '',
}: {
  title: string
  value: number | string
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  iconColor: string
  prefix?: string
  suffix?: string
}) {
  const isPositive = (change ?? 0) >= 0
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <div className="text-3xl font-bold tracking-tight">
              {prefix}
              {typeof value === 'number' ? value.toLocaleString() : value}
              {suffix}
            </div>
            {change !== undefined && (
              <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {isPositive ? <IconArrowUpRight className="h-3 w-3" /> : <IconArrowDownRight className="h-3 w-3" />}
                {Math.abs(change)}% {changeLabel ?? 'from yesterday'}
              </div>
            )}
          </div>
          <div className={`rounded-xl p-3 ${iconColor}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border-border rounded-lg border p-3 shadow-lg">
        <p className="text-sm font-semibold">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-muted-foreground text-xs">
            {p.name}: <span className="text-foreground font-medium">{p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const stats = mockDashboardStats
  const recentWorkOrders = mockWorkOrders.slice(0, 5)

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight hidden sm:block">Birhan Garage</h1>
        </div>
        <div className="ml-auto flex items-center space-x-3">
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Thursday, June 5, 2025 · Addis Ababa
          </p>
        </div>

        {/* KPI Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Daily Revenue"
            value={stats.dailyRevenue}
            change={stats.dailyRevenueChange}
            icon={<IconCoin className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />}
            iconColor="bg-emerald-100 dark:bg-emerald-900"
            prefix="ETB "
          />
          <StatCard
            title="Vehicles in Garage"
            value={stats.vehiclesInGarage}
            change={stats.vehiclesInGarageChange}
            changeLabel="new today"
            icon={<IconCar className="h-5 w-5 text-blue-700 dark:text-blue-300" />}
            iconColor="bg-blue-100 dark:bg-blue-900"
          />
          <StatCard
            title="Active Repairs"
            value={stats.activeRepairs}
            icon={<IconTool className="h-5 w-5 text-orange-700 dark:text-orange-300" />}
            iconColor="bg-orange-100 dark:bg-orange-900"
          />
          <StatCard
            title="Monthly Revenue"
            value={stats.monthlyRevenue}
            change={stats.monthlyRevenueChange}
            changeLabel="from last month"
            icon={<IconTrendingUp className="h-5 w-5 text-violet-700 dark:text-violet-300" />}
            iconColor="bg-violet-100 dark:bg-violet-900"
            prefix="ETB "
          />
        </div>

        {/* Secondary KPIs */}
        <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div className="bg-card border-border flex items-center gap-3 rounded-xl border p-4">
            <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900">
              <IconClipboardList className="h-4 w-4 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Pending Approvals</p>
              <p className="text-lg font-bold">{stats.pendingApprovals}</p>
            </div>
          </div>
          <div className="bg-card border-border flex items-center gap-3 rounded-xl border p-4">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
              <IconClipboardList className="h-4 w-4 text-blue-700 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Pending Inspections</p>
              <p className="text-lg font-bold">{stats.pendingInspections}</p>
            </div>
          </div>
          <div className="bg-card border-border flex items-center gap-3 rounded-xl border p-4">
            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900">
              <IconAlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Inventory Alerts</p>
              <p className="text-lg font-bold">{stats.inventoryAlerts}</p>
            </div>
          </div>
          <div className="bg-card border-border flex items-center gap-3 rounded-xl border p-4">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
              <IconCircleCheck className="h-4 w-4 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Completed Today</p>
              <p className="text-lg font-bold">{stats.completedToday}</p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Revenue & Repairs</CardTitle>
              <CardDescription>Monthly overview — Jan to Jun 2025</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={mockRevenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.06} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue (ETB)" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Job Status Donut */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Job Status</CardTitle>
              <CardDescription>Current distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={mockJobStatusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {mockJobStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Work Orders */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Active Work Orders</CardTitle>
              <Badge variant="secondary" className="text-xs">{recentWorkOrders.length} orders</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentWorkOrders.map((wo) => {
                const cfg = workOrderStatusConfig[wo.status]
                return (
                  <div key={wo.id} className="border-border hover:bg-muted/40 flex items-center gap-3 rounded-lg border p-3 transition-colors">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}>
                      <IconTool className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{wo.vehicleName}</p>
                      <p className="text-muted-foreground truncate text-xs">{wo.description}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge className={`${cfg.bg} ${cfg.color} border-0 text-xs`}>
                        {cfg.label}
                      </Badge>
                      {wo.technicianName && (
                        <span className="text-muted-foreground text-xs">{wo.technicianName}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Technician Leaderboard */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Technician Board</CardTitle>
              <CardDescription>Today's performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTechnicians.map((tech, i) => (
                <div key={tech.id} className="flex items-center gap-3">
                  <span className="text-muted-foreground w-4 text-xs font-bold">{i + 1}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{tech.name}</p>
                    <p className="text-muted-foreground text-xs">{tech.specialization[0]}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{tech.efficiency}%</p>
                    <p className="text-muted-foreground text-xs">{tech.completedToday} done</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {mockActivityFeed.map((item, i) => (
                  <div key={item.id} className="flex gap-3 pb-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${activityColors[item.type]}`}>
                        {activityIcons[item.icon]}
                      </div>
                      {i < mockActivityFeed.length - 1 && (
                        <div className="bg-border mt-1 w-px flex-1" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <p className="text-sm">{item.message}</p>
                      <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                        <span>{item.user}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <IconClockHour4 className="h-3 w-3" />
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}
