'use server';

import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { createSession, deleteSession } from './actions/auth/auth';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 8 characters long'),
});

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 8 characters long'),
});

export async function signUp(prevState: { success: boolean; message: string }, formData: FormData) {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  const validatedFields = registerSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.errors.map((error) => error.message).join(', ');
    return { success: false, message: errors };
  }

  const prisma = new PrismaClient();
  const userFound = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  if (userFound) {
    return { success: false, message: 'user already exist' };
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  const userCreated = await prisma.user.create({
    data: {
      email: email as string,
      password: hashedPassword as string,
    },
  });
  // Create a session for the user
  const userId = userCreated.id.toString();
  await createSession(userId);
  return { success: true, message: ' user register success' };
}

// recibir el estado previo ({})
export async function login(prevState: { success: boolean; message: string }, formData: FormData) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const prisma = new PrismaClient();
  const email = formData.get('email');
  const password = formData.get('password');

  const validatedFields = loginSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.errors.map((error) => error.message).join(', ');
    return { success: false, message: errors };
  }

  //find user in db
  const userFound = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });
  if (!userFound) {
    return { success: false, message: 'User no exist' };
  }

  // 3. Compare the user's password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(validatedFields.data.password, userFound.password);
  // If the password does not match, return early

  if (!passwordMatch) {
    return { success: false, message: 'Invalid Credentials ' };
  }
  // 4. If login successful, create a session for the user and redirect
  const userId = userFound.id.toString();
  await createSession(userId);

  return { success: true, message: 'Login success' };
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
