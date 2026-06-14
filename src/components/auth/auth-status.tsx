import Link from 'next/link';

import { signOutAction } from '@/app/auth/actions';
import { hasSupabaseEnv } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

export async function AuthStatus() {
  if (!hasSupabaseEnv()) {
    return (
      <Link className="text-sm font-semibold text-[#3d6f5a] hover:text-[#255844]" href="/auth/login">
        Anmelden
      </Link>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link className="text-sm font-semibold text-[#3d6f5a] hover:text-[#255844]" href="/auth/login">
        Anmelden
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="max-w-44 truncate text-[#4d554c]">{user.email}</span>
      <form action={signOutAction}>
        <button
          className="font-semibold text-[#3d6f5a] transition hover:text-[#255844]"
          type="submit"
        >
          Abmelden
        </button>
      </form>
    </div>
  );
}
