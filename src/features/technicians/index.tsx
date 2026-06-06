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
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { useGarageStore } from '@/stores/garageStore'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const SKILL_LEVEL_COLORS: Record<string, string> = {
  junior: 'bg-gray-100 text-gray-700',
  intermediate: 'bg-blue-100 text-blue-700',
  senior: 'bg-purple-100 text-purple-700',
  expert: 'bg-amber-100 text-amber-700',
}

export function TechniciansPage() {
  const navigate = useNavigate()
  const { technicians, isLoadingTechnicians, fetchTechnicians } = useGarageStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [skillFilter, setSkillFilter] = useState('')

  useEffect(() => {
    fetchTechnicians()
  }, [fetchTechnicians])

  const filtered = technicians.filter((t) => {
    const matchesSearch = !searchQuery || 
      t.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSkill = !skillFilter || 
      t.skills.some(s => s.category === skillFilter)
    return matchesSearch && matchesSkill
  })

  const allSkills = Array.from(new Set(technicians.flatMap(t => t.skills.map(s => s.category))))

  const perfData = technicians.slice(0, 8).map(t => ({
    name: t.employeeId,
    jobs: t.completedJobs,
    rating: Math.round(t.averageRating * 10) / 10,
  }))

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
            <h2 className='text-2xl font-bold tracking-tight'>Technicians</h2>
            <p className='text-muted-foreground'>Manage technicians and view performance.</p>
          </div>
        </div>

        <div className='flex items-center gap-2 mb-6'>
          <div className='relative flex-1 max-w-sm'>
            <input
              type='search'
              placeholder='Search by ID...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className='flex h-9 items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus:outline-none focus:ring-1 focus:ring-ring'
          >
            <option value=''>All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        {isLoadingTechnicians ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardContent className='pt-6'>
                  <div className='flex items-center gap-3 mb-4'>
                    <Skeleton className='h-12 w-12 rounded-full' />
                    <div>
                      <Skeleton className='h-4 w-24 mb-1' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                  </div>
                  <Skeleton className='h-2 w-full mb-2' />
                  <Skeleton className='h-3 w-32' />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <p className='text-muted-foreground'>No technicians found</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6'>
              {filtered.map((tech) => {
                const workloadPercent = Math.round((tech.currentWorkload / tech.maxWorkload) * 100)
                const primarySkill = tech.skills[0]
                return (
                  <Link key={tech.id} to='/technicians/$technicianId' params={{ technicianId: tech.id }}>
                    <Card className='h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer'>
                      <CardContent className='pt-6'>
                        <div className='flex items-center gap-3 mb-4'>
                          <Avatar>
                            <AvatarFallback className='bg-primary/10 text-primary font-semibold'>
                              {tech.employeeId.slice(-2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className='font-medium text-sm'>{tech.employeeId}</p>
                            <p className='text-xs text-muted-foreground'>
                              {primarySkill ? `${primarySkill.category.replace(/_/g, ' ')} · ${primarySkill.level}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <div className='flex justify-between text-xs'>
                            <span className='text-muted-foreground'>Workload</span>
                            <span>{workloadPercent}%</span>
                          </div>
                          <Progress value={workloadPercent} className='h-1.5' />
                          <div className='flex justify-between text-xs text-muted-foreground pt-1'>
                            <span>{tech.completedJobs} jobs</span>
                            <span>★ {tech.averageRating.toFixed(1)}</span>
                            <span>${tech.hourlyRate}/hr</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width='100%' height={250}>
                  <BarChart data={perfData}>
                    <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
                    <XAxis dataKey='name' className='text-xs' stroke='hsl(var(--muted-foreground))' />
                    <YAxis className='text-xs' stroke='hsl(var(--muted-foreground))' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey='jobs' fill='#3b82f6' radius={[4, 4, 0, 0]} name='Completed Jobs' />
                    <Bar dataKey='rating' fill='#10b981' radius={[4, 4, 0, 0]} name='Rating' />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </Main>
    </>
  )
}

export { TechniciansPage as default }
