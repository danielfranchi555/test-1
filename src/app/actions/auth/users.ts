'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return { data: users, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: 'Failed to fetch users' };
  }
}
