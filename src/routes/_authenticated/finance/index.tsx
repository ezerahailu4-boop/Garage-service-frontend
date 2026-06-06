import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/finance'

export const Route = createFileRoute('/_authenticated/finance/')({
  component: Page,
})
