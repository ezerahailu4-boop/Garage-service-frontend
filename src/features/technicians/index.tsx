import { IconBriefcase, IconStar, IconCircleDot } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockTechnicians } from '@/data/mock'

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  available: { label: 'Available', color: 'text-emerald-600', dot: 'bg-emerald-500' },
  busy: { label: 'Busy', color: 'text-orange-600', dot: 'bg-orange-500' },
  off_duty: { label: 'Off Duty', color: 'text-slate-500', dot: 'bg-slate-400' },
}

export default function Technicians() {
  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconBriefcase className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Technicians</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Button size="sm">Add Technician</Button>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Technicians</h1>
          <p className="text-muted-foreground text-sm">{mockTechnicians.length} team members</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockTechnicians.map((tech) => {
            const sc = statusConfig[tech.status]
            return (
              <Card key={tech.id} className="hover:border-primary/30 cursor-pointer transition-all hover:shadow-md">
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-primary/10 text-primary text-base font-bold">
                          {tech.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-background ${sc.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{tech.name}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        {tech.specialization.join(' · ')}
                      </p>
                      <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${sc.color}`}>
                        <IconCircleDot className="h-3 w-3" />
                        {sc.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <IconStar className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-medium">{tech.rating}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-base font-bold">{tech.activeJobs}</p>
                      <p className="text-muted-foreground text-xs">Active</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-base font-bold">{tech.completedToday}</p>
                      <p className="text-muted-foreground text-xs">Done Today</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2 text-center">
                      <p className="text-base font-bold">{tech.efficiency}%</p>
                      <p className="text-muted-foreground text-xs">Efficiency</p>
                    </div>
                  </div>

                  {/* Efficiency bar */}
                  <div className="mt-3">
                    <div className="bg-muted h-1.5 w-full rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all"
                        style={{ width: `${tech.efficiency}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {tech.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {tech.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tech.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Main>
    </>
  )
}
