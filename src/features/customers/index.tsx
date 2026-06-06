import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { IconUsers, IconSearch, IconPlus, IconPhone, IconMail, IconCar, IconCoin } from '@tabler/icons-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockCustomers } from '@/data/mock'

export default function Customers() {
  const [search, setSearch] = useState('')
  const filtered = mockCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  )

  return (
    <>
      <Header>
        <div className="flex items-center gap-2">
          <IconUsers className="text-muted-foreground h-5 w-5" />
          <span className="font-semibold">Customers</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground text-sm">{mockCustomers.length} registered customers</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="gap-2">
              <Link to="/vehicle-status">
                <IconSearch className="h-4 w-4" />
                Check Vehicle Status
              </Link>
            </Button>
            <Button className="gap-2">
              <IconPlus className="h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search customers..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Customer Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((customer) => (
            <Card key={customer.id} className="hover:border-primary/30 cursor-pointer transition-all hover:shadow-md">
              <CardContent className="pt-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                      {customer.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{customer.name}</p>
                    <div className="text-muted-foreground mt-1 flex flex-col gap-0.5 text-xs">
                      <span className="flex items-center gap-1.5">
                        <IconPhone className="h-3 w-3" /> {customer.phone}
                      </span>
                      <span className="flex items-center gap-1.5 truncate">
                        <IconMail className="h-3 w-3" /> {customer.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <IconCar className="text-muted-foreground h-3.5 w-3.5" />
                      <span className="text-sm font-bold">{customer.totalVehicles}</span>
                    </div>
                    <p className="text-muted-foreground text-xs">Vehicles</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <IconCoin className="text-muted-foreground h-3.5 w-3.5" />
                      <span className="text-sm font-bold">{(customer.totalSpent / 1000).toFixed(0)}k</span>
                    </div>
                    <p className="text-muted-foreground text-xs">ETB Spent</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">
                    Since {new Date(customer.joinedAt).getFullYear()}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {customer.loyaltyPoints} pts
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}
