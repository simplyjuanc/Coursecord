import UserRow from './UserRow';

type CourseTableProps = {
  users: { [userType: string]: { name: string; email: string; id: string }}[];
  type: string;
  removeUser: (role: string, userId: string) => void;
};
export default function UserTable(props: CourseTableProps) {
  const { users, type, removeUser } = props;
  console.log(`UserTable - ${type} - users :>> `, users);
  return (
    <div>
      {users.length === 0 ? (
        <p>No {type}s currently assigned!</p>
      ) : (
        <div className='p-8 mx-auto drop-shadow'>
          <div className='grid grid-cols-5 border rounded-lg border-primary-2 border-opacity-30'>
            <div className='col-span-1 py-1 pb-2 font-medium text-center bg-opacity-25 rounded-tl-lg border-1 text bg-primary-1 border-primary-2'>
              Actions
            </div>
            <div className='col-span-2 py-1 pb-2 font-medium text-center bg-opacity-25 border-1 text bg-primary-1 border-primary-2'>
              Name
            </div>
            <div className='col-span-2 py-1 pb-2 font-medium text-center bg-opacity-25 border-1 text bg-primary-1 border-primary-2'>
              Email
            </div>
            <div className='grid grid-cols-5 col-span-5 rounded-b-lg border-primary-2'>
              {users.map((user) => (
                  <UserRow
                    key={user[type].id}
                    user={user[type]}
                    role={type}
                    removeUser={removeUser}
                  />
                ))}
            </div>
            <div className='h-2 col-span-7 -mt-1 bg-white rounded-b-lg'></div>
          </div>
        </div>
      )}
    </div>
  );
}
