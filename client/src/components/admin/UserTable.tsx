import UserRow from './UserRow';

type CourseTableProps = {
  users: { [userType: string]: { name: string; email: string; id: string }}[];
  type: string;
  removeUser: (role: string, userId: string) => void;
};

export default function UserTable(props: CourseTableProps) {
  const { users, type, removeUser } = props;
  console.log('users, type, removeUser :>> ', props);
  return (
    <div>
      {users.length === 0 ? (
        <p>No {type}s currently assigned!</p>
      ) : (
        <div className='p-8 mx-auto drop-shadow'>
          <div className='grid grid-cols-5 border border-primary-2 border-opacity-30 rounded-lg'>
            <div className='col-span-1 py-1 pb-2 text-lg font-semibold text-center bg-opacity-25 border-1 text bg-primary-1 border-primary-2 rounded-tl-lg'>
              Actions
            </div>
            <div className='col-span-2 py-1 pb-2 text-lg font-semibold text-center bg-opacity-25 border-1 text bg-primary-1 border-primary-2'>
              Name
            </div>
            <div className='col-span-2 py-1 pb-2 text-lg font-semibold text-center bg-opacity-25 border-1 text bg-primary-1 border-primary-2'>
              Email
            </div>
            <div className='col-span-5 grid grid-cols-5 rounded-b-lg border-primary-2'>
              {users.map((user) => (
                  <UserRow
                    key={user[type].id}
                    user={user[type]}
                    role={type}
                    removeUser={removeUser}
                  />
                ))}
            </div>
            <div className='col-span-7 rounded-b-lg h-2 bg-white -mt-1'></div>
          </div>
        </div>
      )}
    </div>
  );
}
