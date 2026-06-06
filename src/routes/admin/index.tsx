import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/admin'

export const Route = createFileRoute('/admin/')({
  component: Page,
})
