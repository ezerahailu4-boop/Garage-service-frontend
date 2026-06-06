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
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSuspenseQuery } from '@tanstack/react-query'
import { IconWrench } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { WORK_ORDER_STATUS, PRIORITY_CONFIG } from '../lib/quotations-constants'
import type { WorkOrder } from '@/types/garage'
import { useGarageStore } from '@/stores/garageStore'

const KANBAN_COLUMNS = Object.keys(WORK_ORDER_STATUS) as Array<keyof typeof WORK_ORDER_STATUS>

export function WorkOrdersPage() {
  const { workOrders, isLoadingWorkOrders, fetchWorkOrders } = useGarageStore()
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    fetchWorkOrders()
  }, [fetchWorkOrders])

  const filteredWorkOrders = useMemo(() => {
    if (priorityFilter === 'all') return workOrders
    return workOrders.filter((wo) => wo.priority === priorityFilter)
  }, [workOrders, priorityFilter])

  const getColumnWorkOrders = (status: string) => filteredWorkOrders.filter((wo) => wo.status === status)

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
            <h2 className='text-2xl font-bold tracking-tight'>Work Orders</h2>
            <p className='text-muted-foreground'>
              Manage repair work orders and track progress.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Label className='text-sm'>Filter by Priority:</Label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='All priorities' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Priorities</SelectItem>
                {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4'>
            {KANBAN_COLUMNS.map((colKey) => {
              const columnWOs = getColumnWorkOrders(colKey)
              const statusInfo = WORK_ORDER_STATUS[colKey]
              return (
                <Card key={colKey} className='flex flex-col'>
                  <CardHeader className='pb-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-semibold'>{statusInfo.label}</span>
                      <Badge className={`${statusInfo.color} border-0 text-xs font-medium px-2 py-0.5`}>
                        {columnWOs.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='flex-1 p-0'>
                    <ScrollArea className='h-[calc(100vh-220px)]'>
                      <div className='space-y-3 p-4 pt-0'>
                        {isLoadingWorkOrders ? (
                          <p className='text-xs text-muted-foreground text-center py-4'>Loading...</p>
                        ) : columnWOs.length === 0 ? (
                          <p className='text-xs text-muted-foreground text-center py-4'>No work orders</p>
                        ) : (
                          columnWOs.map((wo: WorkOrder) => {
                            const priorityInfo = PRIORITY_CONFIG[wo.priority] || { label: wo.priority, color: 'bg-gray-100 text-gray-700' }
                            return (
                              <Link
                                key={wo.id}
                                to='/work-orders/$workOrderId'
                                params={{ workOrderId: wo.id }}
                                className='block rounded-md border bg-card p-3 shadow-sm transition-colors hover:bg-accent/50'
                              >
                                <div className='flex items-start justify-between gap-2 mb-2'>
                                  <span className='text-xs font-mono font-medium'>
                                    WO-{wo.id.slice(0, 8).toUpperCase()}
                                  </span>
                                  <Badge className={`${priorityInfo.color} border-0 text-xs font-medium px-2 py-0.5`}>
                                    {priorityInfo.label}
                                  </Badge>
                                </div>
                                <p className='text-sm font-medium mb-1'>Vehicle {wo.vehicleId.slice(0, 8).toUpperCase()}</p>
                                <p className='text-xs text-muted-foreground mb-2'>
                                  {wo.assignments.length > 0 ? `Tech: ${wo.assignments[0].technicianId.slice(0, 8).toUpperCase()}` : 'Unassigned'}
                                </p>
                                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                                  <span>{wo.partsNeeded.length} parts</span>
                                  {wo.estimatedCompletionDate && (
                                    <span>Due: {new Date(wo.estimatedCompletionDate).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </Link>
                            )
                          })
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </Main>
    </>
  )
}
