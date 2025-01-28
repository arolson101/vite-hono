import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <>
      <nav className='flex gap-3 border-b pb-5'>
        <Link to='/admin' className='[&.active]:font-bold' activeOptions={{ exact: true }}>
          Admin Home
        </Link>

        <Link to='/admin/members' className='[&.active]:font-bold'>
          Members
        </Link>
      </nav>

      <div className='pt-4'>
        <Outlet />
      </div>
    </>
  )
}
