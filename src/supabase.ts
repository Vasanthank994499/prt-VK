import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Robust fallback to prevent app crashes when environment variables are missing
let supabaseClient: any;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Falling back to local preview mode.');

    // A deeply chainable no-op proxy: any property access or function call
    // returns another proxy, so chains like supabase.channel('x').on(...).subscribe()
    // never crash.
    const createChainableProxy = (): any => {
      const handler: ProxyHandler<any> = {
        get: (_target, prop) => {
          // For 'then' return undefined so that awaiting this proxy
          // resolves immediately instead of hanging forever.
          if (prop === 'then') return undefined;
          // Return a function that itself returns a chainable proxy
          return (..._args: any[]) => createChainableProxy();
        },
        apply: () => createChainableProxy(),
      };
      return new Proxy(function () {}, handler);
    };

    supabaseClient = new Proxy({}, {
      get: (_target, prop) => {
        // ---- auth ----
        if (prop === 'auth') {
          return {
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({
              data: { subscription: { unsubscribe: () => {} } },
            }),
            signInWithOAuth: async () => ({
              error: new Error('Supabase credentials are not configured'),
            }),
            signInWithPassword: async () => ({
              error: new Error('Supabase credentials are not configured'),
            }),
            signOut: async () => ({ error: null }),
          };
        }

        // ---- storage ----
        if (prop === 'storage') {
          return {
            from: () => ({
              upload: async () => ({
                data: null,
                error: new Error('Supabase credentials are not configured'),
              }),
              getPublicUrl: () => ({ data: { publicUrl: '' } }),
            }),
          };
        }

        // ---- channel (realtime) ----
        if (prop === 'channel') {
          return () => ({
            on: function () { return this; },
            subscribe: () => ({ unsubscribe: () => {} }),
          });
        }

        // ---- removeChannel ----
        if (prop === 'removeChannel') {
          return () => {};
        }

        // ---- from (database queries) ----
        if (prop === 'from') {
          return () => ({
            select: () => ({
              order: () => ({ data: [], error: null }),
              eq: () => ({ data: [], error: null }),
              then: (cb: any) => Promise.resolve(cb({ data: [], error: null })),
            }),
            insert: () => ({
              then: (cb: any) => Promise.resolve(cb({ data: null, error: null })),
            }),
            update: () => ({
              eq: () => ({
                then: (cb: any) => Promise.resolve(cb({ data: null, error: null })),
              }),
            }),
            delete: () => ({
              eq: () => ({
                then: (cb: any) => Promise.resolve(cb({ data: null, error: null })),
              }),
            }),
            upsert: () => ({
              then: (cb: any) => Promise.resolve(cb({ data: null, error: null })),
            }),
          });
        }

        // ---- Fallback: return a deeply chainable no-op proxy ----
        return createChainableProxy();
      },
    });
  } else {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (err) {
  console.error('Failed to initialize Supabase client:', err);
}

export const supabase = supabaseClient;
