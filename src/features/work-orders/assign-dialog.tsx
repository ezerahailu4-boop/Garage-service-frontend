import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { WorkOrder } from '@/types/garage'
import { useGarageStore } from '@/stores/garageStore'

interface AssignTechnicianDialogProps {
  workOrderId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignTechnicianDialog({ workOrderId, open, onOpenChange }: AssignTechnicianDialogProps) {
  const { technicians, assignTechnician, fetchTechnicians } = useGarageStore()
  const [technicianId, setTechnicianId] = useState('')
  const [task, setTask] = useState('')
  const [estimatedHours, setEstimatedHours] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      fetchTechnicians()
      setTechnicianId('')
      setTask('')
      setEstimatedHours('')
    }
  }, [open, fetchTechnicians])

  const handleSubmit = async () => {
    if (!technicianId || !task || !estimatedHours) return
    setSubmitting(true)
    try {
      await assignTechnician(workOrderId, technicianId, task, Number(estimatedHours))
      onOpenChange(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
          <DialogDescription>Select a technician and define the task for this work order.</DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label>Technician</Label>
            <Select value={technicianId} onValueChange={setTechnicianId}>
              <SelectTrigger>
                <SelectValue placeholder='Select technician' />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.employeeId} - ${t.hourlyRate}/hr
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>Task Description</Label>
            <Textarea placeholder='Describe the task...' value={task} onChange={(e) => setTask(e.target.value)} />
          </div>
          <div className='space-y-2'>
            <Label>Estimated Hours</Label>
            <Select value={estimatedHours} onValueChange={setEstimatedHours}>
              <SelectTrigger>
                <SelectValue placeholder='Select hours' />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((h) => (
                  <SelectItem key={h} value={String(h)}>{h} hour{h > 1 ? 's' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!technicianId || !task || !estimatedHours || submitting}>
            {submitting ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
