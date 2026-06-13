'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { createClient } from '@/lib/supabase/server';

function getRedirectPath(formData: FormData) {
  const next = formData.get('next');

  return typeof next === 'string' && next.startsWith('/') ? next : '/lernen';
}

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function redirectWithError(message: string, next: string) {
  const params = new URLSearchParams({
    error: message,
    next,
  });

  redirect(`/login?${params.toString()}`);
}

export async function signIn(formData: FormData) {
  const email = getRequiredString(formData, 'email');
  const password = getRequiredString(formData, 'password');
  const next = getRedirectPath(formData);

  if (!email || !password) {
    redirectWithError('Bitte gib E-Mail und Passwort ein.', next);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithError('Login fehlgeschlagen. Prüfe E-Mail und Passwort.', next);
  }

  redirect(next);
}

export async function signUp(formData: FormData) {
  const email = getRequiredString(formData, 'email');
  const password = getRequiredString(formData, 'password');
  const displayName = getRequiredString(formData, 'displayName');
  const next = getRedirectPath(formData);

  if (!email || !password) {
    redirectWithError('Bitte gib E-Mail und Passwort ein.', next);
  }

  if (password.length < 6) {
    redirectWithError('Das Passwort muss mindestens 6 Zeichen lang sein.', next);
  }

  const supabase = await createClient();
  const origin = (await headers()).get('origin') ?? '';
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: origin ? `${origin}/auth/callback?next=${encodeURIComponent(next)}` : undefined,
      data: {
        display_name: displayName || null,
      },
    },
  });

  if (error) {
    redirectWithError('Registrierung fehlgeschlagen. Vielleicht gibt es diesen Account schon.', next);
  }

  const params = new URLSearchParams({
    message: 'Account erstellt. Falls Supabase E-Mail-Bestätigung verlangt, bestätige bitte deine E-Mail.',
    next,
  });

  redirect(`/login?${params.toString()}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/lernen');
}
