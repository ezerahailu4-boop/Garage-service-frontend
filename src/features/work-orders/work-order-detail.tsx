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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { IconArrowLeft, IconWrench } from '@tabler/icons-react'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { WORK_ORDER_STATUS, PRIORITY_CONFIG } from '../lib/quotations-constants'
import type { WorkOrder, WorkOrderAssignment } from '@/types/garage'
import { useGarageStore } from '@/stores/garageStore'
import { AssignTechnicianDialog } from './assign-dialog'

const PARTS_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  ordered: 'bg-blue-100 text-blue-700',
  received: 'bg-purple-100 text-purple-700',
  installed: 'bg-green-100 text-green-700',
}

const ASSIGNMENT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
}

export function WorkOrderDetail() {
  const { workOrderId } = useParams({ from: '/_authenticated/work-orders/$workOrderId' })
  const { fetchWorkOrder, selectedWorkOrder, updateWorkOrderStatus, technicians, fetchTechnicians } = useGarageStore()
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string>('')

  useEffect(() => {
    fetchWorkOrder(workOrderId)
    fetchTechnicians()
  }, [fetchWorkOrder, workOrderId, fetchTechnicians])

  if (!selectedWorkOrder) {
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
            <p className='text-muted-foreground'>Loading work order...</p>
          </div>
        </Main>
      </>
    )
  }

  const wo = selectedWorkOrder
  const statusInfo = WORK_ORDER_STATUS[wo.status] || { label: wo.status, color: 'bg-gray-100 text-gray-700' }
  const priorityInfo = PRIORITY_CONFIG[wo.priority] || { label: wo.priority, color: 'bg-gray-100 text-gray-700' }
  const progressMap: Record<string, number> = {
    pending: 10,
    assigned: 25,
    in_progress: 50,
    waiting_parts: 60,
    quality_check: 75,
    completed: 90,
    delivered: 100,
  }

  const handleStatusChange = async (newStatus: string) => {
    await updateWorkOrderStatus(wo.id, newStatus as WorkOrder['status'])
    setStatusDialogOpen(false)
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
            <Link to='/work-orders'>
              <IconArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Work Order WO-{wo.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Created {new Date(wo.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className='ml-auto flex items-center gap-2'>
            <Badge className={`${statusInfo.color} border-0 text-xs font-medium px-3 py-1`}>{statusInfo.label}</Badge>
            <Badge className={`${priorityInfo.color} border-0 text-xs font-medium px-3 py-1`}>{priorityInfo.label}</Badge>
          </div>
        </div>

        <div className='mb-6'>
          <div className='h-2 w-full rounded-full bg-muted'>
            <div
              className='h-2 rounded-full bg-primary transition-all'
              style={{ width: `${progressMap[wo.status] || 0}%` }}
            />
          </div>
          <p className='text-xs text-muted-foreground mt-1'>{Math.round(progressMap[wo.status] || 0)}% complete</p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Technician</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Est. Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wo.assignments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className='h-16 text-center text-sm text-muted-foreground'>
                          No assignments yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      wo.assignments.map((a: WorkOrderAssignment, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className='text-sm'>{technicians.find(t => t.id === a.technicianId)?.employeeId || a.technicianId.slice(0, 8).toUpperCase()}</TableCell>
                          <TableCell className='text-sm'>{a.task}</TableCell>
                          <TableCell className='text-sm'>{a.estimatedHours}h</TableCell>
                          <TableCell>
                            <Badge className={`${ASSIGNMENT_STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-700'} border-0 text-xs font-medium px-2 py-0.5`}>
                              {a.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parts Needed</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Part Number</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wo.partsNeeded.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className='h-16 text-center text-sm text-muted-foreground'>
                          No parts needed.
                        </TableCell>
                      </TableRow>
                    ) : (
                      wo.partsNeeded.map((part, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className='text-sm'>{part.name}</TableCell>
                          <TableCell className='text-sm font-mono text-xs'>{part.partNumber || '-'}</TableCell>
                          <TableCell className='text-sm'>{part.quantity}</TableCell>
                          <TableCell>
                            <Badge className={`${PARTS_STATUS_COLORS[part.status] || 'bg-gray-100 text-gray-700'} border-0 text-xs font-medium px-2 py-0.5`}>
                              {part.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {wo.status === 'quality_check' && (
              <Card>
                <CardHeader>
                  <CardTitle>Quality Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground mb-2'>
                    {wo.qualityCheckNotes || 'No quality check notes yet.'}
                  </p>
                  {wo.qualityCheckPassed !== undefined && (
                    <Badge className={`${wo.qualityCheckPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-0 text-xs font-medium px-2 py-0.5`}>
                      {wo.qualityCheckPassed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {['pending', 'assigned', 'in_progress', 'waiting_parts'].includes(wo.status) && (
                  <>
                    <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className='w-full' size='sm' onClick={() => setPendingStatus(wo.status)}>
                          Update Status
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Work Order Status</DialogTitle>
                          <DialogDescription>Select a new status for this work order.</DialogDescription>
                        </DialogHeader>
                        <Select value={pendingStatus} onValueChange={setPendingStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder='Select status' />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(WORK_ORDER_STATUS).map(([key, val]) => (
                              <SelectItem key={key} value={key} disabled={key === wo.status}>{val.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <DialogFooter>
                          <Button variant='outline' onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
                          <Button onClick={() => handleStatusChange(pendingStatus)} disabled={!pendingStatus || pendingStatus === wo.status}>
                            Update
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button className='w-full' size='sm' variant='outline' onClick={() => setShowAssignDialog(true)}>
                      <IconWrench className='h-4 w-4 mr-2' />
                      Assign Technician
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <AssignTechnicianDialog
              workOrderId={wo.id}
              open={showAssignDialog}
              onOpenChange={setShowAssignDialog}
            />
          </div>
        </div>
      </Main>
    </>
  )
}
