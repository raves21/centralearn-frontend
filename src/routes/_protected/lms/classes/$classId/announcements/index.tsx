import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/lms/classes/$classId/announcements/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/lms/classes/$classId/announcements/"!</div>
}
