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
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'
import { useGarageStore } from '@/stores/garageStore'
import type { Inspection, InspectionCategory, SeverityLevel, Vehicle, User } from '@/types/garage'

const CATEGORY_LABELS: Record<InspectionCategory, string> = {
  engine: 'Engine',
  transmission: 'Transmission',
  brake_system: 'Brake System',
  suspension: 'Suspension',
  steering: 'Steering',
  electrical: 'Electrical',
  ac_system: 'AC System',
  cooling_system: 'Cooling System',
  tires: 'Tires',
  body_work: 'Body Work',
}

const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; color: string; dotColor: string }> = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200', dotColor: 'bg-red-500' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200', dotColor: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dotColor: 'bg-yellow-500' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
}

const CONDITION_CONFIG: Record<string, { label: string; color: string }> = {
  excellent: { label: 'Excellent', color: 'bg-green-100 text-green-700' },
  good: { label: 'Good', color: 'bg-blue-100 text-blue-700' },
  fair: { label: 'Fair', color: 'bg-yellow-100 text-yellow-700' },
  poor: { label: 'Poor', color: 'bg-red-100 text-red-700' },
}

export function InspectionDetail() {
  const { inspectionId } = useParams({ from: '/_authenticated/inspections/$inspectionId' })
  const navigate = useNavigate()
  const { selectedInspection, fetchInspection, vehicles, users } = useGarageStore()

  useEffect(() => {
    fetchInspection(inspectionId)
  }, [fetchInspection, inspectionId])

  const vehicle = useMemo(() => {
    if (!selectedInspection) return null
    return vehicles.find(v => v.id === selectedInspection.vehicleId)
  }, [selectedInspection, vehicles])

  const inspector = useMemo(() => {
    if (!selectedInspection) return null
    return users.find(u => u.id === selectedInspection.inspectorId)
  }, [selectedInspection, users])

  const handleCreateQuotation = () => {
    navigate({ to: '/quotations/new', search: { inspectionId: selectedInspection?.id } })
  }

  if (!selectedInspection) {
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
            <p className='text-muted-foreground'>Loading inspection...</p>
          </div>
        </Main>
      </>
    )
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
          <Button variant='ghost' size='icon' onClick={() => navigate({ to: '/inspections' })}>
            <IconArrowLeft className='h-4 w-4' />
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              Inspection INS-{selectedInspection.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Started {new Date(selectedInspection.startedAt).toLocaleDateString()}
              {selectedInspection.completedAt && ` &bull; Completed ${new Date(selectedInspection.completedAt).toLocaleDateString()}`}
            </p>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2 space-y-6'>
            {selectedInspection.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm'>{selectedInspection.notes}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Findings ({selectedInspection.findings.length})</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {selectedInspection.findings.map((finding) => {
                  const severityConfig = SEVERITY_CONFIG[finding.severity]
                  const categoryLabel = CATEGORY_LABELS[finding.category]
                  return (
                    <Card key={finding.id} className='border-l-4' style={{ borderLeftColor: `var(--${finding.severity === 'critical' ? 'red' : finding.severity === 'high' ? 'orange' : finding.severity === 'medium' ? 'yellow' : 'blue'}-500)` }}>
                      <CardContent className='p-4'>
                        <div className='flex items-start justify-between mb-3'>
                          <div className='flex items-center gap-2'>
                            <div className={`w-2 h-2 rounded-full ${severityConfig.dotColor}`} />
                            <Badge className={`${severityConfig.color} border-0 text-xs font-medium px-2 py-0.5`}>
                              {severityConfig.label}
                            </Badge>
                            <Badge variant='outline' className='text-xs'>
                              {categoryLabel}
                            </Badge>
                          </div>
                        </div>
                        <h3 className='font-semibold text-base mb-2'>{finding.title}</h3>
                        <p className='text-sm text-muted-foreground mb-3'>{finding.description}</p>
                        <div className='space-y-3'>
                          <div>
                            <p className='text-xs font-medium text-muted-foreground mb-1'>Recommended Action</p>
                            <p className='text-sm'>{finding.recommendedAction}</p>
                          </div>

                          {finding.requiredParts && finding.requiredParts.length > 0 && (
                            <div>
                              <p className='text-xs font-medium text-muted-foreground mb-2'>Required Parts</p>
                              <div className='border rounded-md overflow-hidden'>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Part #</TableHead>
                                      <TableHead>Qty</TableHead>
                                      <TableHead>Unit Price</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {finding.requiredParts.map((part, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className='text-sm'>{part.name}</TableCell>
                                        <TableCell className='text-sm font-mono'>{part.partNumber || '-'}</TableCell>
                                        <TableCell className='text-sm'>{part.quantity}</TableCell>
                                        <TableCell className='text-sm'>${part.unitPrice.toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          )}

                          <div className='flex items-center justify-between pt-2'>
                            <span className='text-xs font-medium text-muted-foreground'>
                              Estimated Labor: {finding.estimatedLaborHours} hours
                            </span>
                          </div>

                          {finding.photos && finding.photos.length > 0 && (
                            <div className='pt-2'>
                              <p className='text-xs font-medium text-muted-foreground mb-2'>Photos</p>
                              <div className='flex gap-2'>
                                {finding.photos.map((photo, idx) => (
                                  <img
                                    key={idx}
                                    src={photo}
                                    alt={`Finding ${idx + 1}`}
                                    className='w-16 h-16 object-cover rounded-md border'
                                    onError={(e) => {
                                      e.currentTarget.src = `https://picsum.photos/seed/${finding.id}-${idx}/100/100`
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Vehicle & Inspector</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <p className='text-xs text-muted-foreground'>Vehicle</p>
                  <p className='text-sm font-medium'>
                    {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : selectedInspection.vehicleId.slice(0, 8).toUpperCase()}
                  </p>
                  {vehicle && (
                    <p className='text-xs text-muted-foreground'>{vehicle.licensePlate} &bull; {vehicle.vin.slice(0, 17)}</p>
                  )}
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Inspector</p>
                  <p className='text-sm font-medium'>
                    {inspector ? `${inspector.firstName} ${inspector.lastName}` : selectedInspection.inspectorId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Status</p>
                  <Badge className={`${STATUS_CONFIG[selectedInspection.status].color} border-0 text-xs font-medium px-2 py-0.5`}>
                    {STATUS_CONFIG[selectedInspection.status].label}
                  </Badge>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground'>Overall Condition</p>
                  <Badge className={`${CONDITION_CONFIG[selectedInspection.overallCondition].color} border-0 text-xs font-medium px-2 py-0.5`}>
                    {CONDITION_CONFIG[selectedInspection.overallCondition].label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className='w-full' onClick={handleCreateQuotation}>
                  Create Quotation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}