'use client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { use, useActionState } from 'react';
import { resetPassword } from '@/app/actions';

export default function Page({ params }: { params: Promise<{ token: string }> }) {
  const param = use(params);

  const initialState = { success: false, message: '' };
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>You can reset your password here</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <input type="hidden" name="token" value={param?.token} />
          <div className="grid gap-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" name="password" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" name="confirmPassword" required />
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Resetting...' : 'Reset Password'}
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
              <Link href="/auth/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
