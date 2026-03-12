
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/admin/dashboard');
      } else {
        router.push('/login');
      }
    };

    checkSession();
  }, [router, supabase]);

  return <p>Loading...</p>;
}
