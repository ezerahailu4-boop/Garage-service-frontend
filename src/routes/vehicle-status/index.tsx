import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vehicle-status/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/vehicle-status/"!</div>
}
