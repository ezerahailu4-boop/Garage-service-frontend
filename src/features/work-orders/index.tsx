import {
  IconTool,
  IconPlus,
  IconClock,
  IconUser,
  IconAlertTriangle,
} from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { mockWorkOrders, type WorkOrderStatus } from '@/data/mock'

const KANBAN_COLUMNS: { status: WorkOrderStatus; title: string; color: string }[] = [
  { status: 'pending', title: 'Pending', color: 'border-t-slate-400' },
  { status: 'assigned', title: 'Assigned', color: 'border-t-blue-500' },
  { status: 'in_progress', title: 'In Progress', color: 'border-t-orange-500' },
  { status: 'waiting_parts', title: 'Waiting Parts', color: 'border-t-amber-500' },
  { status: 'quality_check', title: 'QC Check', color: 'border-t-violet-500' },
  { status: 'completed', title: 'Completed', color: 'border-t-emerald-500' },
]

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-50 text-red-600 dark:bg-red-950',
  high: 'bg-orange-50 text-orange-600 dark:bg-orange-950',
  medium: 'bg-amber-50 text-amber-600 dark:bg-amber-950',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800',
}

export default function WorkOrders() {
  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconTool className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Work Orders</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button size="sm" className="gap-2">
            <IconPlus className="h-4 w-4" />
            New Work Order
          </Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className="overflow-hidden">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Work Orders</h1>
            <p className="text-muted-foreground text-sm">Kanban board — {mockWorkOrders.length} total orders</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '60vh' }}>
          {KANBAN_COLUMNS.map((col) => {
            const orders = mockWorkOrders.filter((wo) => wo.status === col.status)
            return (
              <div
                key={col.status}
                className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/40 dark:bg-muted/20"
              >
                {/* Column Header */}
                <div className={`rounded-t-xl border-t-4 ${col.color} bg-card/60 px-3 py-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{col.title}</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {orders.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex flex-1 flex-col gap-2 p-2">
                  {orders.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center py-8">
                      <p className="text-muted-foreground text-xs">No orders</p>
                    </div>
                  ) : (
                    orders.map((wo) => (
                      <div
                        key={wo.id}
                        className="bg-card border-border hover:border-primary/30 cursor-pointer rounded-lg border p-3 shadow-sm transition-all hover:shadow-md"
                      >
                        {/* Priority */}
                        <div className="mb-2 flex items-center justify-between">
                          <span className={`rounded-md px-1.5 py-0.5 text-xs font-medium capitalize ${priorityColors[wo.priority]}`}>
                            {wo.priority}
                          </span>
                          <span className="text-muted-foreground font-mono text-xs">{wo.id.toUpperCase()}</span>
                        </div>

                        {/* Vehicle */}
                        <p className="text-sm font-semibold leading-tight">{wo.vehicleName}</p>
                        <p className="text-muted-foreground mt-0.5 font-mono text-xs">{wo.vehiclePlate}</p>

                        {/* Description */}
                        <p className="text-muted-foreground mt-2 line-clamp-2 text-xs">{wo.description}</p>

                        {/* Footer */}
                        <div className="mt-3 flex items-center justify-between">
                          {wo.technicianName ? (
                            <div className="flex items-center gap-1">
                              <div className="bg-primary/10 flex h-5 w-5 items-center justify-center rounded-full">
                                <IconUser className="text-primary h-3 w-3" />
                              </div>
                              <span className="text-xs font-medium truncate max-w-[100px]">{wo.technicianName.split(' ')[0]}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs italic">Unassigned</span>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <IconClock className="h-3 w-3" />
                            <span className="text-xs">{wo.estimatedHours}h</span>
                          </div>
                        </div>

                        {/* Due date warning */}
                        {wo.priority === 'urgent' && (
                          <div className="mt-2 flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 dark:bg-red-950">
                            <IconAlertTriangle className="h-3 w-3 text-red-500" />
                            <span className="text-xs font-medium text-red-600">Due today</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Main>
    </>
  )
}
