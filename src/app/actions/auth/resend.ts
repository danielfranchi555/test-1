'use server';

import { EmailTemplate } from '@/components/resend/email-template';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email(),
});

export async function sendEmail(
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  const prisma = new PrismaClient();
  const email = formData.get('email');

  const validatedFields = schema.safeParse({
    email: email,
  });

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid fields' };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  if (!user) {
    return { success: false, message: 'Email not found' };
  }

  const resetToken = await prisma.passwordResetToken.create({
    data: {
      token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
      userId: user.id,
      resetAt: null,
    },
  });

  console.log(user.name);

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password/token=${resetToken.token}`;

  const { data, error } = await resend.emails.send({
    from: 'onboarding@danielfranchi.dev',
    to: email as string,
    subject: 'Reset Password',
    react: EmailTemplate({ resetLink, userName: user.name as string }) as React.ReactElement,
  });

  if (error) {
    console.log(error);
    return { success: false, message: 'Error sending email' };
  }
  console.log(data);
  return { success: true, message: 'Email sent' };
}
