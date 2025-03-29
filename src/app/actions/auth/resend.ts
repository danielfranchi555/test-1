'use server';

import { EmailTemplate } from '@/components/resend/email-template';
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
  const email = formData.get('email');

  const validatedFields = schema.safeParse({
    email: email,
  });

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid fields' };
  }
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email as string,
    subject: 'Reset Password',
    react: EmailTemplate({ firstName: 'John' }) as React.ReactElement,
  });

  if (error) {
    console.log(error);
    return { success: false, message: 'error sending email' };
  }
  console.log(data);
  return { success: true, message: 'email sent' };
}
