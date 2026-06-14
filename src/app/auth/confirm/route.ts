import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';

import { hasSupabaseEnv } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null;
  const requestedNext = requestUrl.searchParams.get('next') ?? '/lernen';
  const next = requestedNext.startsWith('/') && !requestedNext.startsWith('//') ? requestedNext : '/lernen';

  if (code && hasSupabaseEnv()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  if (tokenHash && type && hasSupabaseEnv()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  const params = new URLSearchParams({
    error: 'Der Bestätigungslink ist ungültig oder abgelaufen.',
  });

  return NextResponse.redirect(new URL(`/auth/login?${params.toString()}`, requestUrl.origin));
}
