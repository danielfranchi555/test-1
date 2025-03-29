import React from 'react';
import ButtonLogut from '@/components/ButtonLogut';
import { getUsers } from '@/app/actions/auth/users';
export default async function page() {
  const { data: users, error } = await getUsers();
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-blue-200">
      <div>
        <h2>Users:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      </div>
      <ButtonLogut />
    </main>
  );
}
