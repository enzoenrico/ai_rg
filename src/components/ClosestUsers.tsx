export const ClosestUsers = ({
  users
}: {
  users: { name: string; pfp: string }[]
}) => {
  return (
    <div className='flex flex-col gap-4'>
      {users.map(user => (
        <div className='flex  gap-2'>
          <img src={user.pfp} />
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  )
}
