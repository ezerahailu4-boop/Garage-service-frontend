import {
  IconLayoutDashboard,
  IconUsers,
  IconCar,
  IconClipboardList,
  IconTool,
  IconBriefcase,
  IconPackage,
  IconCoin,
  IconChartBar,
  IconSettings,
  IconUserCog,
  IconPalette,
  IconNotification,
  IconHelp,
  IconSearch,
  IconShieldCheck,
} from '@tabler/icons-react'
import { Wrench } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Manager Admin',
    email: 'manager@birhangarage.et',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Birhan Garage',
      logo: Wrench,
      plan: 'Enterprise',
    },
  ],
  navGroups: [
    {
      title: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        { title: 'Customers', url: '/customers' as any, icon: IconUsers },
        { title: 'Vehicles', url: '/vehicles' as any, icon: IconCar },
        { title: 'Vehicle Status', url: '/vehicle-status' as any, icon: IconSearch },
        { title: 'Inspections', url: '/inspections' as any, icon: IconClipboardList },
        { title: 'Work Orders', url: '/work-orders' as any, icon: IconTool },
      ],
    },
    {
      title: 'Resources',
      items: [
        { title: 'Technicians', url: '/technicians' as any, icon: IconBriefcase },
        { title: 'Inventory', url: '/inventory' as any, icon: IconPackage, badge: '3' },
      ],
    },
    {
      title: 'Business',
      items: [
        { title: 'Finance', url: '/finance' as any, icon: IconCoin },
        { title: 'Reports', url: '/reports' as any, icon: IconChartBar },
      ],
    },
    {
      title: 'System',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            { title: 'Profile', url: '/settings', icon: IconUserCog },
            { title: 'Appearance', url: '/settings/appearance', icon: IconPalette },
            { title: 'Notifications', url: '/settings/notifications', icon: IconNotification },
          ],
        },
        { title: 'Inspector', url: '/inspector' as any, icon: IconClipboardList },
        { title: 'Admin', url: '/admin' as any, icon: IconShieldCheck },
        { title: 'Help Center', url: '/help-center', icon: IconHelp },
      ],
    },
  ],
}
