import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Robust fallback to prevent app crashes when environment variables are missing (e.g. during static builds or on initial deployment)
let supabaseClient: any;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Falling back to local preview mode.');
    supabaseClient = new Proxy({}, {
      get: (target, prop) => {
        // Return dummy functions for common supabase methods to prevent crashes
        if (prop === 'auth') {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithOAuth: async () => ({ error: new Error('Supabase credentials are not configured') }),
            signInWithPassword: async () => ({ error: new Error('Supabase credentials are not configured') }),
            signOut: async () => ({ error: null })
          };
        }
        if (prop === 'storage') {
          return {
            from: () => ({
              upload: async () => ({ data: null, error: new Error('Supabase credentials are not configured') }),
              getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
          };
        }
        // Return chainable mock for db queries
        return () => ({
          select: () => ({
            order: () => ({ then: (cb: any) => cb({ data: [], error: null }) }),
            then: (cb: any) => cb({ data: [], error: null })
          }),
          from: () => ({
            select: () => ({
              order: () => ({
                then: (cb: any) => cb({ data: [], error: null }),
                eq: () => ({ then: (cb: any) => cb({ data: [], error: null }) })
              }),
              then: (cb: any) => cb({ data: [], error: null })
            }),
            insert: () => ({ then: (cb: any) => cb({ data: null, error: null }) }),
            delete: () => ({ eq: () => ({ then: (cb: any) => cb({ data: null, error: null }) }) })
          })
        });
      }
    });
  } else {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  console.error('Failed to initialize Supabase client:', err);
}

export const supabase = supabaseClient;

