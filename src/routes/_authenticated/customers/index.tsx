import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/customers'

export const Route = createFileRoute('/_authenticated/customers/')({
  component: Page,
})
