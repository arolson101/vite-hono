import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { getMembers, sleep } from '~/utils.ts'

export const Route = createFileRoute('/admin/members')({
  component: AdminMembers,
  loader: async () => {
    console.info('/admin/members loader called')
    await sleep()

    return {
      members: getMembers(),
    }
  },
})

function AdminMembers() {
  const { members } = Route.useLoaderData()

  return (
    <div className='flex h-full w-full pt-5'>
      <div className='flex w-52 flex-col border-r'>
        <div className='mb-3 font-bold'>Members:</div>

        {members.map(member => (
          <Link key={member.id} className='py-1' activeProps={{ className: 'font-bold' }} to={String(member.id)}>
            {member.name}
          </Link>
        ))}
      </div>

      <div className='px-12'>
        <Outlet />
      </div>
    </div>
  )
}
