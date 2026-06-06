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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { IconArrowLeft, IconPlus, IconTrash } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useGarageStore } from '@/stores/garageStore'
import type { InspectionFinding, InspectionCategory, SeverityLevel, Inspection } from '@/types/garage'

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

const CATEGORIES: InspectionCategory[] = [
  'engine',
  'transmission',
  'brake_system',
  'suspension',
  'steering',
  'electrical',
  'ac_system',
  'cooling_system',
  'tires',
  'body_work',
]

const SEVERITIES: SeverityLevel[] = ['critical', 'high', 'medium', 'low']

const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; color: string; dotColor: string }> = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200', dotColor: 'bg-red-500' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200', dotColor: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dotColor: 'bg-yellow-500' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' },
}

function generateId() {
  return crypto.randomUUID()
}

export function NewInspection() {
  const navigate = useNavigate()
  const { vehicles, users, createInspection, currentUser } = useGarageStore()
  const [activeTab, setActiveTab] = useState('findings')
  const [findings, setFindings] = useState<InspectionFinding[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [overallCondition, setOverallCondition] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good')
  const [notes, setNotes] = useState('')

  const [findingForm, setFindingForm] = useState({
    title: '',
    description: '',
    category: '' as InspectionCategory,
    severity: '' as SeverityLevel,
    recommendedAction: '',
    estimatedLaborHours: 0,
    parts: [{ name: '', partNumber: '', quantity: 1, unitPrice: 0 }],
  })

  useEffect(() => {
    if (vehicles.length === 0) {
      // Fetch vehicles will be handled by parent or on mount
    }
  }, [vehicles])

  const conditions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ]

  const handleAddFinding = () => {
    if (!findingForm.title || !findingForm.description || !findingForm.category || !findingForm.severity) return

    const newFinding: InspectionFinding = {
      id: generateId(),
      title: findingForm.title,
      description: findingForm.description,
      category: findingForm.category,
      severity: findingForm.severity,
      recommendedAction: findingForm.recommendedAction,
      estimatedLaborHours: findingForm.estimatedLaborHours,
      requiredParts: findingForm.parts.filter(p => p.name),
      photos: [],
      videos: [],
      isApproved: false,
    }

    setFindings([...findings, newFinding])
    setFindingForm({
      title: '',
      description: '',
      category: '' as InspectionCategory,
      severity: '' as SeverityLevel,
      recommendedAction: '',
      estimatedLaborHours: 0,
      parts: [{ name: '', partNumber: '', quantity: 1, unitPrice: 0 }],
    })
  }

  const handleAddPart = () => {
    setFindingForm({
      ...findingForm,
      parts: [...findingForm.parts, { name: '', partNumber: '', quantity: 1, unitPrice: 0 }],
    })
  }

  const handleRemovePart = (index: number) => {
    setFindingForm({
      ...findingForm,
      parts: findingForm.parts.filter((_, i) => i !== index),
    })
  }

  const handlePartChange = (index: number, field: string, value: string | number) => {
    const newParts = [...findingForm.parts]
    newParts[index] = { ...newParts[index], [field]: value }
    setFindingForm({ ...findingForm, parts: newParts })
  }

  const handleSaveInspection = async () => {
    if (!selectedVehicleId) return

    const inspectorId = currentUser?.id || users.find(u => u.role === 'inspector')?.id

    const inspectionData: Omit<Inspection, 'id' | 'createdAt' | 'updatedAt'> = {
      vehicleId: selectedVehicleId,
      inspectorId: inspectorId || '',
      status: 'draft',
      findings,
      overallCondition,
      notes: notes || undefined,
      startedAt: new Date().toISOString(),
    }

    const inspection = await createInspection(inspectionData)
    navigate({ to: '/inspections/$inspectionId', params: { inspectionId: inspection.id } })
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
            <h1 className='text-2xl font-bold tracking-tight'>New Inspection</h1>
            <p className='text-muted-foreground text-sm'>
              Create a new vehicle inspection record
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='findings'>Findings</TabsTrigger>
            <TabsTrigger value='review'>Review & Submit</TabsTrigger>
          </TabsList>

          <TabsContent value='findings' className='space-y-6 mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a vehicle' />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.make} {v.model} ({v.year}) - {v.licensePlate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Finding</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Category</Label>
                    <Select value={findingForm.category} onValueChange={(v) => setFindingForm({ ...findingForm, category: v as InspectionCategory })}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {CATEGORY_LABELS[cat]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Severity</Label>
                    <Select value={findingForm.severity} onValueChange={(v) => setFindingForm({ ...findingForm, severity: v as SeverityLevel })}>
                      <SelectTrigger>
                        <SelectValue placeholder='Select severity' />
                      </SelectTrigger>
                      <SelectContent>
                        {SEVERITIES.map((sev) => (
                          <SelectItem key={sev} value={sev}>
                            <div className='flex items-center gap-2'>
                              <div className={`w-2 h-2 rounded-full ${SEVERITY_CONFIG[sev].dotColor}`} />
                              {SEVERITY_CONFIG[sev].label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Title</Label>
                  <Input
                    value={findingForm.title}
                    onChange={(e) => setFindingForm({ ...findingForm, title: e.target.value })}
                    placeholder='Finding title'
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={findingForm.description}
                    onChange={(e) => setFindingForm({ ...findingForm, description: e.target.value })}
                    placeholder='Detailed description'
                  />
                </div>

                <div>
                  <Label>Recommended Action</Label>
                  <Textarea
                    value={findingForm.recommendedAction}
                    onChange={(e) => setFindingForm({ ...findingForm, recommendedAction: e.target.value })}
                    placeholder='Recommended repair action'
                  />
                </div>

                <div>
                  <Label>Labor Hours</Label>
                  <Input
                    type='number'
                    value={findingForm.estimatedLaborHours}
                    onChange={(e) => setFindingForm({ ...findingForm, estimatedLaborHours: parseFloat(e.target.value) || 0 })}
                    placeholder='0.0'
                  />
                </div>

                <div className='space-y-3'>
                  <Label>Parts</Label>
                  {findingForm.parts.map((part, index) => (
                    <div key={index} className='grid grid-cols-4 gap-2 items-end'>
                      <Input
                        placeholder='Part name'
                        value={part.name}
                        onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder='Part number'
                        value={part.partNumber}
                        onChange={(e) => handlePartChange(index, 'partNumber', e.target.value)}
                      />
                      <Input
                        type='number'
                        placeholder='Qty'
                        value={part.quantity}
                        onChange={(e) => handlePartChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                      <div className='flex gap-1'>
                        <Input
                          type='number'
                          placeholder='Price'
                          value={part.unitPrice}
                          onChange={(e) => handlePartChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                        {findingForm.parts.length > 1 && (
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleRemovePart(index)}
                          >
                            <IconTrash className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant='outline' size='sm' onClick={handleAddPart}>
                    <IconPlus className='h-4 w-4 mr-1' />
                    Add Part
                  </Button>
                </div>

                <Button onClick={handleAddFinding} disabled={!findingForm.title || !findingForm.description || !findingForm.category || !findingForm.severity}>
                  Add Finding
                </Button>
              </CardContent>
            </Card>

            {findings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Added Findings ({findings.length})</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {findings.map((finding, idx) => {
                    const severityConfig = SEVERITY_CONFIG[finding.severity]
                    return (
                      <Card key={finding.id} className='border-l-4' style={{ borderLeftColor: `var(--${finding.severity === 'critical' ? 'red' : finding.severity === 'high' ? 'orange' : finding.severity === 'medium' ? 'yellow' : 'blue'}-500)` }}>
                        <CardContent className='p-3'>
                          <div className='flex items-start justify-between'>
                            <div>
                              <h4 className='font-medium text-sm'>{finding.title}</h4>
                              <p className='text-xs text-muted-foreground'>{CATEGORY_LABELS[finding.category]}</p>
                            </div>
                            <Badge className={`${severityConfig.color} border-0 text-xs`}>
                              {severityConfig.label}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='review' className='space-y-6 mt-6'>
            <Card>
              <CardHeader>
                <CardTitle>Overall Condition</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={overallCondition} onValueChange={(v) => setOverallCondition(v as any)}>
                  <div className='grid grid-cols-2 gap-4'>
                    {conditions.map((cond) => (
                      <div key={cond.value} className='flex items-center space-x-2'>
                        <RadioGroupItem value={cond.value} id={cond.value} />
                        <Label htmlFor={cond.value}>{cond.label}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <p className='text-sm'>Vehicle: {vehicles.find(v => v.id === selectedVehicleId)?.make || 'Not selected'}</p>
                  <p className='text-sm'>Findings: {findings.length}</p>
                  <p className='text-sm'>Total Labor: {findings.reduce((sum, f) => sum + f.estimatedLaborHours, 0)} hours</p>
                  <p className='text-sm'>Total Parts: {findings.reduce((sum, f) => sum + (f.requiredParts?.reduce((s, p) => s + p.unitPrice * p.quantity, 0) || 0), 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='Additional notes for this inspection'
                  rows={4}
                />
              </CardContent>
            </Card>

            <div className='flex justify-end'>
              <Button onClick={handleSaveInspection} disabled={!selectedVehicleId || findings.length === 0}>
                Save Inspection
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}