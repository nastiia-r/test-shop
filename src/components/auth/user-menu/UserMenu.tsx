'use client';

import { clearSavedOverrides } from '@/hooks/use-saved-photo';
import { logout } from '@/server/actions/auth';
import { Avatar } from '@/shared/ui/avatar';
import { DropdownMenu, MenuButton, MenuHeader, MenuLink } from '@/shared/ui/dropdown-menu';

interface UserMenuProps {
  name: string;
  email: string;
}

export function UserMenu({ name, email }: UserMenuProps) {
  return (
    <DropdownMenu label="Account menu" trigger={<Avatar name={name} />}>
      <MenuHeader title={name} subtitle={email} />
      <MenuLink href="/profile">Your collection</MenuLink>
      <form action={logout} onSubmit={clearSavedOverrides}>
        <MenuButton type="submit">Log out</MenuButton>
      </form>
    </DropdownMenu>
  );
}
