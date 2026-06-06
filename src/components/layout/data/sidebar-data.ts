import {
  IconLayoutDashboard,
  IconSettings,
  IconTool,
  IconUserCog,
  IconPalette,
  IconNotification,
  IconChecklist,
  IconHelp,
  IconUsers,
  IconCar,
  IconClipboardCheck,
  IconFileInvoice,
  IconTools,
  IconUsersGroup,
  IconBox,
  IconChartBar,
  IconCreditCard,
  IconTruck,
  IconCarAdd,
  IconClipboardList,
  IconFileCheck,
  IconClock,
  IconWrench,
  IconChecklist as IconTaskChecklist,
  IconTrendingUp,
} from '@tabler/icons-react'
import { Command } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Garage Admin',
    email: 'admin@garage.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Garage Pro',
      logo: Command,
      plan: 'Enterprise',
    },
  ],
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/' as const,
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: 'Operations',
      items: [
        {
          title: 'Customers',
          url: '/customers' as const,
          icon: IconUsers,
        },
        {
          title: 'Vehicles',
          url: '/vehicles' as const,
          icon: IconCar,
        },
        {
          title: 'Inspections',
          url: '/inspections' as const,
          icon: IconClipboardCheck,
        },
        {
          title: 'Quotations',
          url: '/quotations' as const,
          icon: IconFileInvoice,
        },
        {
          title: 'Work Orders',
          url: '/work-orders' as const,
          icon: IconTools,
        },
      ],
    },
    {
      title: 'Resources',
      items: [
        {
          title: 'Technicians',
          url: '/technicians' as const,
          icon: IconUsersGroup,
        },
        {
          title: 'Inventory',
          url: '/inventory' as const,
          icon: IconBox,
        },
        {
          title: 'Suppliers',
          url: '/suppliers' as const,
          icon: IconTruck,
        },
      ],
    },
    {
      title: 'Finance',
      items: [
        {
          title: 'Invoices',
          url: '/invoices' as const,
          icon: IconCreditCard,
        },
        {
          title: 'Reports',
          url: '/reports' as const,
          icon: IconChartBar,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: '/settings' as const,
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: '/settings/account' as const,
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance' as const,
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications' as const,
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: '/settings/display' as const,
              icon: IconChecklist,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center' as const,
          icon: IconHelp,
        },
      ],
    },
  ],
}
