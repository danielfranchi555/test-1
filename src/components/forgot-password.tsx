'use client';
import React, { useActionState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { sendEmail } from '@/app/actions/auth/resend';

const ForgotPassword = () => {
  const initialState = { success: false, message: '' };
  const [state, formAction, isPending] = useActionState(sendEmail, initialState);
  console.log(state);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Please enter your email to reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">New Password</Label>
                <Input id="email" type="email" name="email" required />
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Sending...' : 'Submit'}
              </Button>
              {!state.success && (
                <p className="text-red-500 text-center text-sm">{state.message}</p>
              )}
              {state.success && (
                <p className="text-green-500 text-center  text-sm">{state.message}</p>
              )}
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPassword;
