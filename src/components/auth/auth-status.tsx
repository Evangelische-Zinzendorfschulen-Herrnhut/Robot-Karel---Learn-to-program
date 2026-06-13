'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type AuthStatusProps = {
  nextPath?: string;
};

const hasSupabaseConfig =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

export function AuthStatus({ nextPath = '/lernen' }: AuthStatusProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig);

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
  }

  if (isLoading) {
    return (
      <div className="border-t border-[#d8d0bd] pt-4 text-xs leading-5 text-[#5f665e]">
        Account wird geprüft...
      </div>
    );
  }

  if (!email) {
    const href = `/login?next=${encodeURIComponent(nextPath)}`;

    return (
      <div className="border-t border-[#d8d0bd] pt-4">
        <Link
          className="block border border-[#20231f] bg-[#20231f] px-3 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-[#3d6f5a]"
          href={href}
        >
          Einloggen
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t border-[#d8d0bd] pt-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3d6f5a]">Account</p>
      <p className="mt-2 break-words text-sm leading-5 text-[#20231f]">{email}</p>
      <button
        className="mt-3 w-full border border-[#20231f] px-3 py-2 text-sm font-semibold text-[#20231f] transition-colors hover:bg-white"
        onClick={handleSignOut}
        type="button"
      >
        Ausloggen
      </button>
    </div>
  );
}
