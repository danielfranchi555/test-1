'use client';

import { logout } from '@/app/actions';
import { Button } from './ui/button';
import { useFormStatus } from 'react-dom';

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}

const ButtonLogut = () => {
  return (
    <form action={logout}>
      <LogoutButton />
    </form>
  );
};

export default ButtonLogut;
