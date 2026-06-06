import { useState, useEffect } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useGarageStore } from '@/stores/garageStore'
import { useDebounce } from '@/hooks/use-debounce'
import { VEHICLE_STATUS } from './lib/vehicle-constants'
import { useNavigate, useParams } from '@tanstack/react-router'
import { IconArrowLeft, IconClipboard, IconWrench, IconHistory, IconPhoto, IconLoader } from '@tabler/icons-react'

const VEHICLE_STATUS_OPTIONS: Vehicle['status'][] = [
  'registered',
  'under_inspection',
  'awaiting_approval',
  'approved',
  'in_repair',
  'quality_check',
  'ready',
  'delivered',
]

interface Activity {
  id: string
  type: string
  description: string
  timestamp: string
  user: string
}

interface RepairHistory {
  id: string
  workOrderId: string
  date: string
  description: string
  cost: number
  status: string
}

interface InspectionRecord {
  id: string
  inspectionId: string
  date: string
  overallCondition: string
  findingsCount: number
}

const mockTimeline: Activity[] = [
  { id: '1', type: 'registration', description: 'Vehicle registered in system', timestamp: '2024-01-15T09:00:00Z', user: 'John Smith' },
  { id: '2', type: 'inspection', description: 'Initial inspection started', timestamp: '2024-01-15T10:30:00Z', user: 'Mike Johnson' },
  { id: '3', type: 'quotation', description: 'Quotation created for repairs', timestamp: '2024-01-16T14:00:00Z', user: 'Sarah Davis' },
  { id: '4', type: 'approval', description: 'Quotation approved by customer', timestamp: '2024-01-17T11:00:00Z', user: 'John Smith' },
  { id: '5', type: 'repair', description: 'Work order created', timestamp: '2024-01-17T15:00:00Z', user: 'Mike Johnson' },
]

const mockRepairHistory: RepairHistory[] = [
  { id: '1', workOrderId: 'WO-001', date: '2024-01-17', description: 'Brake pad replacement and rotor resurfacing', cost: 245.50, status: 'Completed' },
  { id: '2', workOrderId: 'WO-002', date: '2024-01-18', description: 'Oil change and filter replacement', cost: 89.99, status: 'Completed' },
]

const mockInspectionHistory: InspectionRecord[] = [
  { id: '1', inspectionId: 'INS-001', date: '2024-01-15', overallCondition: 'good', findingsCount: 3 },
  { id: '2', inspectionId: 'INS-002', date: '2024-01-20', overallCondition: 'excellent', findingsCount: 1 },
]

const mockImages = [
  'https://picsum.photos/seed/v1/400/300',
  'https://picsum.photos/seed/v2/400/300',
  'https://picsum.photos/seed/v3/400/300',
  'https://picsum.photos/seed/v4/400/300',
]

export function VehicleDetail() {
  const navigate = useNavigate()
  const { vehicleId } = useParams({ from: '/_authenticated/vehicles/$vehicleId' })
  const [activeTab, setActiveTab] = useState('timeline')
  const { selectedVehicle, fetchVehicle, customers, fetchCustomers, isLoadingVehicles, updateVehicleStatus } = useGarageStore()

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle(vehicleId)
    }
    fetchCustomers()
  }, [vehicleId, fetchVehicle, fetchCustomers])

  const customer = customers.find(c => c.id === selectedVehicle?.customerId)

  const handleStatusChange = (newStatus: Vehicle['status']) => {
    if (vehicleId) {
      updateVehicleStatus(vehicleId, newStatus)
    }
  }

  if (isLoadingVehicles || !selectedVehicle) {
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
          <div className='flex items-center justify-center h-64'>
            <IconLoader className='h-6 w-6 animate-spin' />
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
        <div className='mb-6'>
          <Button variant='ghost' size='sm' onClick={() => navigate({ to: '/vehicles' })} className='mb-4'>
            <IconArrowLeft className='h-4 w-4 mr-2' />
            Back to Vehicles
          </Button>

          <Card>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div>
                  <CardTitle className='text-2xl'>
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </CardTitle>
                  <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
                    <span>VIN: <span className='font-mono'>{selectedVehicle.vin}</span></span>
                    <Badge className={`${VEHICLE_STATUS[selectedVehicle.status]?.color || 'bg-gray-100 text-gray-700'} border-0`}>
                      {VEHICLE_STATUS[selectedVehicle.status]?.label || selectedVehicle.status}
                    </Badge>
                    <span>License: {selectedVehicle.licensePlate}</span>
                    <span>Color: {selectedVehicle.color}</span>
                  </div>
                </div>
                <select
                  value={selectedVehicle.status}
                  onChange={(e) => handleStatusChange(e.target.value as Vehicle['status'])}
                  className='h-9 rounded-md border border-input bg-background px-3 py-1 text-sm'
                >
                  {VEHICLE_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {VEHICLE_STATUS[status]?.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-3 gap-4 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Customer</span>
                  <p className='font-medium'>{customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown'}</p>
                </div>
                <div>
                  <span className='text-muted-foreground'>Mileage</span>
                  <p className='font-medium'>{selectedVehicle.mileage.toLocaleString()} mi</p>
                </div>
                <div>
                  <span className='text-muted-foreground'>Registered</span>
                  <p className='font-medium'>{new Date(selectedVehicle.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-6'>
          {selectedVehicle.currentInspectionId && (
            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3'>
                  <IconClipboard className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Current Inspection</p>
                    <p className='font-medium'>INS-{selectedVehicle.currentInspectionId.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {selectedVehicle.currentWorkOrderId && (
            <Card>
              <CardContent className='pt-6'>
                <div className='flex items-center gap-3'>
                  <IconWrench className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='text-sm text-muted-foreground'>Current Work Order</p>
                    <p className='font-medium'>WO-{selectedVehicle.currentWorkOrderId.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value='timeline'>Timeline</TabsTrigger>
            <TabsTrigger value='repair'>Repair History</TabsTrigger>
            <TabsTrigger value='inspection'>Inspection History</TabsTrigger>
            <TabsTrigger value='images'>Images</TabsTrigger>
          </TabsList>

          <TabsContent value='timeline' className='mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {mockTimeline.map((activity, index) => (
                    <div key={activity.id} className='flex gap-4'>
                      <div className='flex flex-col items-center'>
                        <div className='h-2 w-2 rounded-full bg-primary' />
                        {index < mockTimeline.length - 1 && <div className='h-full w-px bg-border' />}
                      </div>
                      <div className='pb-4'>
                        <p className='font-medium'>{activity.description}</p>
                        <p className='text-sm text-muted-foreground'>
                          {new Date(activity.timestamp).toLocaleString()} - {activity.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='repair' className='mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Repair History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {mockRepairHistory.map((repair) => (
                    <div key={repair.id} className='p-4 rounded-lg border'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <p className='font-medium'>{repair.description}</p>
                          <p className='text-sm text-muted-foreground'>WO-{repair.workOrderId}</p>
                        </div>
                        <Badge className='bg-green-100 text-green-700 border-0'>
                          {repair.status}
                        </Badge>
                      </div>
                      <div className='flex justify-between items-center mt-2'>
                        <span className='text-sm'>{repair.date}</span>
                        <span className='font-semibold'>${repair.cost.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='inspection' className='mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Inspection History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {mockInspectionHistory.map((inspection) => (
                    <div key={inspection.id} className='p-4 rounded-lg border'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <p className='font-medium'>Inspection #{inspection.inspectionId}</p>
                          <p className='text-sm text-muted-foreground'>
                            {inspection.findingsCount} findings reported
                          </p>
                        </div>
                        <Badge className='bg-blue-100 text-blue-700 border-0 capitalize'>
                          {inspection.overallCondition}
                        </Badge>
                      </div>
                      <p className='text-sm mt-2'>{inspection.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='images' className='mt-4'>
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-4 gap-4'>
                  {mockImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Vehicle image ${index + 1}`}
                      className='w-full h-32 object-cover rounded-md border'
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}