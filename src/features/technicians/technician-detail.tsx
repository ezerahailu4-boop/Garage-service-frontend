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
import { useGarageStore } from '@/stores/garageStore'
import { Link, useParams } from '@tanstack/react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import { useEffect } from 'react'
import { SKILL_LEVEL_COLORS } from './index'

export function TechnicianDetail() {
  const { technicianId } = useParams({ from: '/_authenticated/technicians/$technicianId' })
  const { technicians, fetchTechnician, selectedTechnician, workOrders } = useGarageStore()

  useEffect(() => {
    fetchTechnician(technicianId)
  }, [fetchTechnician, technicianId])

  const tech = technicians.find(t => t.id === selectedTechnician?.id) || selectedTechnician

  if (!tech) {
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
            <p className='text-muted-foreground'>Loading technician...</p>
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
          <Button variant='ghost' size='icon' asChild>
            <Link to='/technicians'>
              <IconArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>{tech.employeeId}</h1>
            <p className='text-muted-foreground text-sm'>Technician Profile</p>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <p className='text-xs text-muted-foreground'>Employee ID</p>
                <p className='text-sm font-medium font-mono'>{tech.employeeId}</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Hourly Rate</p>
                <p className='text-sm font-medium'>${tech.hourlyRate.toFixed(2)}/hr</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Status</p>
                <Badge className={tech.isActive ? 'bg-green-100 text-green-700 border-0' : 'bg-red-100 text-red-700 border-0'}>
                  {tech.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Workload</p>
                <div className='flex items-center gap-2'>
                  <Progress value={(tech.currentWorkload / tech.maxWorkload) * 100} className='h-2 flex-1' />
                  <span className='text-xs'>{tech.currentWorkload}/{tech.maxWorkload}</span>
                </div>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Rating</p>
                <p className='text-sm font-medium'>★ {tech.averageRating.toFixed(1)} / 5.0</p>
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Completed Jobs</p>
                <p className='text-sm font-medium'>{tech.completedJobs}</p>
              </div>
            </CardContent>
          </Card>

          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {tech.skills.map((skill, idx) => (
                  <div key={idx} className='flex items-center justify-between p-3 rounded-lg border'>
                    <div>
                      <p className='text-sm font-medium'>{skill.category.replace(/_/g, ' ')}</p>
                      <p className='text-xs text-muted-foreground'>{skill.yearsExperience} years experience</p>
                    </div>
                    <Badge className={`${SKILL_LEVEL_COLORS[skill.level] || 'bg-gray-100 text-gray-700'} border-0 text-xs font-medium px-2 py-0.5`}>
                      {skill.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>Active Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(tech.activeWorkOrders?.length || 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className='h-16 text-center text-sm text-muted-foreground'>
                      No active work orders
                    </TableCell>
                  </TableRow>
                ) : (
                  tech.activeWorkOrders?.map((woId) => (
                    <TableRow key={woId}>
                      <TableCell className='font-mono text-sm'>WO-{woId.slice(0, 8).toUpperCase()}</TableCell>
                      <TableCell><Badge variant='outline'>Active</Badge></TableCell>
                      <TableCell><Badge variant='outline'>Normal</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Main>
    </>
  )
}

export { TechnicianDetail as default }
