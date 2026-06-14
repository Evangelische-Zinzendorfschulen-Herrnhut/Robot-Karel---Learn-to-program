'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { hasSupabaseEnv } from '@/lib/supabase/env';
import { createClient } from '@/lib/supabase/server';

function authRedirect(type: 'error' | 'message', value: string) {
  const params = new URLSearchParams({ [type]: value });
  redirect(`/auth/login?${params.toString()}`);
}

export async function signInAction(formData: FormData) {
  if (!hasSupabaseEnv()) {
    authRedirect('error', 'Supabase ist lokal noch nicht konfiguriert.');
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    authRedirect('error', 'Bitte E-Mail und Passwort eingeben.');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    authRedirect('error', 'Login fehlgeschlagen. Prüfe E-Mail und Passwort.');
  }

  revalidatePath('/', 'layout');
  redirect('/lernen');
}

export async function signUpAction(formData: FormData) {
  if (!hasSupabaseEnv()) {
    authRedirect('error', 'Supabase ist lokal noch nicht konfiguriert.');
  }

  const displayName = String(formData.get('displayName') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    authRedirect('error', 'Bitte E-Mail und Passwort eingeben.');
  }

  if (password.length < 8) {
    authRedirect('error', 'Das Passwort muss mindestens 8 Zeichen lang sein.');
  }

  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined,
      data: {
        display_name: displayName || null,
      },
    },
  });

  if (error) {
    authRedirect('error', 'Registrierung fehlgeschlagen. Versuche es bitte erneut.');
  }

  authRedirect('message', 'Konto erstellt. Prüfe bei Bedarf deine E-Mails zur Bestätigung.');
}

export async function signOutAction() {
  if (!hasSupabaseEnv()) {
    redirect('/');
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/');
}
