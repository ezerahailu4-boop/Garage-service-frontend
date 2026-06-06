import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  IconCurrencyDollar,
  IconChartBar,
  IconCar,
  IconTools,
  IconClock,
  IconClipboardCheck,
} from '@tabler/icons-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGarageStore } from '@/stores/garageStore'
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  IconUserPlus,
  IconCarAdd,
  IconClipboardList,
  IconFileCheck,
  IconWrench,
  IconChecklist,
  IconCurrencyDollar as IconDollar,
  IconTrendingUp,
} from '@tabler/icons-react'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

export default function Dashboard() {
  const { dashboardMetrics, isLoadingDashboard, fetchDashboardMetrics } = useGarageStore()

  React.useEffect(() => {
    fetchDashboardMetrics()
  }, [fetchDashboardMetrics])

  if (isLoadingDashboard || !dashboardMetrics) {
    return <DashboardSkeleton />
  }

  const revenueTrend = useQuery({
    queryKey: ['revenue-trend'],
    queryFn: async () => {
      const days = eachDayOfInterval({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      })
      return days.map((day) => ({
        date: format(day, 'MMM dd'),
        revenue: Math.floor(Math.random() * 5000) + 2000,
        jobs: Math.floor(Math.random() * 15) + 3,
      }))
    },
  })

  const jobStatusData = [
    { name: 'In Progress', value: 12, color: '#3b82f6' },
    { name: 'Pending', value: 8, color: '#f59e0b' },
    { name: 'Quality Check', value: 5, color: '#8b5cf6' },
    { name: 'Completed', value: 25, color: '#10b981' },
    { name: 'Delivered', value: 18, color: '#6366f1' },
  ]

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-muted-foreground mt-1'>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          <KPICard
            title='Daily Revenue'
            value={dashboardMetrics.dailyRevenue}
            icon={<IconCurrencyDollar className='h-5 w-5' />}
            href='/invoices'
            change='+12.5%'
            format='currency'
          />
          <KPICard
            title='Monthly Revenue'
            value={dashboardMetrics.monthlyRevenue}
            icon={<IconChartBar className='h-5 w-5' />}
            href='/reports'
            change='+8.2%'
            format='currency'
          />
          <KPICard
            title='Vehicles in Garage'
            value={dashboardMetrics.vehiclesInGarage}
            icon={<IconCar className='h-5 w-5' />}
            href='/vehicles'
            change='+3'
            format='number'
          />
          <KPICard
            title='Active Repairs'
            value={dashboardMetrics.activeRepairs}
            icon={<IconTools className='h-5 w-5' />}
            href='/work-orders'
            change='-2'
            format='number'
          />
          <KPICard
            title='Pending Approvals'
            value={dashboardMetrics.pendingApprovals}
            icon={<IconClock className='h-5 w-5' />}
            href='/quotations'
            change='+1'
            format='number'
          />
          <KPICard
            title='Pending Inspections'
            value={dashboardMetrics.pendingInspections}
            icon={<IconClipboardCheck className='h-5 w-5' />}
            href='/inspections'
            change='+2'
            format='number'
          />
        </div>

        <div className='mt-6 grid gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconTrendingUp className='h-5 w-5 text-blue-500' />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {revenueTrend.isLoading ? (
                <Skeleton className='h-[300px] w-full' />
              ) : (
                <ResponsiveContainer width='100%' height={300}>
                  <AreaChart data={revenueTrend.data}>
                    <defs>
                      <linearGradient id='revenueGradient' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
                        <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                    <XAxis dataKey='date' className='text-xs' stroke='hsl(var(--muted-foreground))' />
                    <YAxis className='text-xs' stroke='hsl(var(--muted-foreground))' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='revenue'
                      stroke='#3b82f6'
                      strokeWidth={2}
                      fill='url(#revenueGradient)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx='50%'
                    cy='50%'
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey='value'
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className='mt-6 grid gap-4 lg:grid-cols-7'>
          <Card className='lg:col-span-4'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconClipboardList className='h-5 w-5 text-blue-500' />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-[300px]'>
                <div className='space-y-4'>
                  {dashboardMetrics.recentActivities.map((activity) => (
                    <div key={activity.id} className='flex items-start gap-3'>
                      <ActivityIcon type={activity.type} />
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium truncate'>{activity.description}</p>
                        <p className='text-xs text-muted-foreground'>
                          {activity.userName} • {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className='lg:col-span-3'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <IconWrench className='h-5 w-5 text-emerald-500' />
                Upcoming Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className='h-[300px]'>
                {dashboardMetrics.upcomingDeliveries.length === 0 ? (
                  <div className='flex flex-col items-center justify-center h-full text-center py-8'>
                    <IconCarAdd className='h-12 w-12 text-muted-foreground/50 mb-2' />
                    <p className='text-sm text-muted-foreground'>No upcoming deliveries</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {dashboardMetrics.upcomingDeliveries.map((vehicle) => (
                      <div key={vehicle.id} className='flex items-center gap-3'>
                        <div className='h-10 w-10 rounded-full bg-muted flex items-center justify-center'>
                          <IconCar className='h-5 w-5 text-muted-foreground' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium truncate'>
                            {vehicle.make} {vehicle.model}
                          </p>
                          <p className='text-xs text-muted-foreground'>{vehicle.licensePlate}</p>
                        </div>
                        <VehicleStatusBadge status={vehicle.status} />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className='mt-6'>
          <Card>
            <CardHeader>
              <CardTitle>Technician Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width='100%' height={250}>
                <BarChart data={dashboardMetrics.technicianPerformance}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                  <XAxis
                    dataKey='name'
                    className='text-xs'
                    stroke='hsl(var(--muted-foreground))'
                  />
                  <YAxis className='text-xs' stroke='hsl(var(--muted-foreground))' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey='efficiency' fill='#3b82f6' radius={[4, 4, 0, 0]} name='Efficiency %' />
                  <Bar dataKey='rating' fill='#10b981' radius={[4, 4, 0, 0]} name='Rating (÷5)' />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

function KPICard({ title, value, icon, href, change, format }: {
  title: string
  value: number
  icon: React.ReactNode
  href: string
  change: string
  format: 'currency' | 'number'
}) {
  const isPositive = change.startsWith('+')
  return (
    <a href={href} className='group'>
      <Card className='transition-all hover:shadow-md hover:border-primary/50'>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            {title}
          </CardTitle>
          <div className='text-muted-foreground'>{icon}</div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold tracking-tight'>
            {format === 'currency' ? formatCurrency(value) : formatNumber(value)}
          </div>
          <p className={`text-xs mt-1 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {change} from last period
          </p>
        </CardContent>
      </Card>
    </a>
  )
}

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

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'vehicle_registered':
      return <div className='h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'><IconCarAdd className='h-4 w-4 text-blue-600' /></div>
    case 'inspection_completed':
      return <div className='h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'><IconClipboardList className='h-4 w-4 text-emerald-600' /></div>
    case 'quotation_created':
      return <div className='h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center'><IconFileCheck className='h-4 w-4 text-purple-600' /></div>
    case 'quotation_approved':
      return <div className='h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center'><IconChecklist className='h-4 w-4 text-green-600' /></div>
    case 'work_started':
      return <div className='h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center'><IconWrench className='h-4 w-4 text-orange-600' /></div>
    case 'work_completed':
      return <div className='h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center'><IconChecklist className='h-4 w-4 text-teal-600' /></div>
    case 'invoice_generated':
      return <div className='h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center'><IconDollar className='h-4 w-4 text-indigo-600' /></div>
    case 'payment_received':
      return <div className='h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center'><IconCurrencyDollar className='h-4 w-4 text-emerald-600' /></div>
    default:
      return <div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center'><IconUserPlus className='h-4 w-4 text-muted-foreground' /></div>
  }
}

function VehicleStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    registered: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    under_inspection: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    awaiting_approval: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    in_repair: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    quality_check: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    ready: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    delivered: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
  }
  const label = status.replace('_', ' ').toUpperCase()
  return (
    <Badge className={`${colors[status] || 'bg-muted'} border-0 text-xs font-medium px-2 py-0.5`}>
      {label}
    </Badge>
  )
}

function DashboardSkeleton() {
  return (
    <>
      <Header>
        <Skeleton className='h-8 w-32' />
        <div className='ml-auto flex items-center space-x-4'>
          <Skeleton className='h-9 w-64' />
          <Skeleton className='h-9 w-9' />
          <Skeleton className='h-9 w-9' />
        </div>
      </Header>
      <Main>
        <Skeleton className='h-8 w-32 mb-6' />
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className='pb-2'>
                <Skeleton className='h-4 w-24' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-8 w-20 mb-1' />
                <Skeleton className='h-3 w-32' />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className='mt-6 grid gap-4 lg:grid-cols-2'>
          <Card>
            <CardHeader><Skeleton className='h-5 w-32' /></CardHeader>
            <CardContent><Skeleton className='h-[300px] w-full' /></CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className='h-5 w-32' /></CardHeader>
            <CardContent><Skeleton className='h-[300px] w-full' /></CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

const topNav = [
  { title: 'Overview', href: '/', isActive: true },
]

