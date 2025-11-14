import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin-panel/sections/$sectionId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/sections/$sectionId/"!</div>
}
