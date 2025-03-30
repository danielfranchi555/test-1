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

const schemaResetPassword = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(6, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(6, 'Password must be at least 8 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export async function resetPassword(
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  const prisma = new PrismaClient();
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validar los campos usando el esquema
  const validatedFields = schemaResetPassword.safeParse({
    token,
    password,
    confirmPassword,
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.errors.map((error) => error.message).join(', ');
    return { success: false, message: errors };
  }

  // Decodificar el token
  const tokenDecoded = decodeURIComponent(token).replace('token=', '');
  console.log({ tokenDecoded });

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: tokenDecoded,
        createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 4) },
        resetAt: null,
      },
    });

    if (!resetToken) {
      console.log(resetToken);
      return { success: false, message: 'Invalid or expired reset token' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUser = prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    const updateToken = prisma.passwordResetToken.update({
      where: { token: tokenDecoded },
      data: { resetAt: new Date() },
    });

    await prisma.$transaction([updateUser, updateToken]);

    // Cerrar la conexión antes de redirigir
    await prisma.$disconnect();

    // Redirigir después de cerrar la conexión
    redirect('/auth/login');
  } catch (error) {
    // Solo manejar errores que no sean redirecciones
    if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
      console.error('Error resetting password:', error);
      return { success: false, message: 'Error resetting password' };
    }
    // Re-lanzar el error de redirección
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
