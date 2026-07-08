"use client";

import { useState } from "react";
import { logoutUser, type PublicUser } from "../actions";
import { getInitials } from "../../lib/user";

type UserMenuProps = {
  user: PublicUser | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLoggedOut: () => void;
};

export default function UserMenu({
  user,
  onLoginClick,
  onSignupClick,
  onLoggedOut,
}: UserMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    await logoutUser();
    onLoggedOut();
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 border-t border-zinc-200 p-2 dark:border-zinc-800">
        <button
          type="button"
          onClick={onLoginClick}
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={onSignupClick}
          className="flex-1 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Sign up
        </button>
      </div>
    );
  }

  return (
    <div className="relative border-t border-zinc-200 p-2 dark:border-zinc-800">
      {menuOpen && (
        <div className="absolute bottom-full left-2 mb-1 w-40 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Log out
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={user.email}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
          {getInitials(user.email)}
        </span>
        <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">
          {user.email}
        </span>
      </button>
    </div>
  );
}
