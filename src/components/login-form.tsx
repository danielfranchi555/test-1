'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { login } from '@/app/actions';
import { LoaderCircle, LogIn } from 'lucide-react';
import Link from 'next/link';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const initialState = { success: false, message: '' };
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <>
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md">
          <LogIn />
        </div>
      </a>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card>
          <CardContent>
            <form action={formAction}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input name="password" id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        {' '}
                        <p>Submiting</p>
                        <LoaderCircle className="animate-spin" />{' '}
                      </div>
                    ) : (
                      'submit'
                    )}
                  </Button>
                </div>
                {state.success && (
                  <p className="text-green-500 text-center text-sm">{state.message}</p>
                )}
                {!state.success && (
                  <p className="text-red-500 text-center text-sm">{state.message}</p>
                )}
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

        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </>
  );
}
