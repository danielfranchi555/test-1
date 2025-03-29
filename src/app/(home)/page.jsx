import React from 'react';
import { PrismaClient } from '@prisma/client';
import ButtonLogut from '@/components/ButtonLogut';

export default async function page() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany();

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
