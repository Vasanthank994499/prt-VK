import { createClient } from '@supabase/supabase-js';

// Production build commit trigger: fresh deployment update
const getSupabaseCredentials = () => {
  const localUrl = localStorage.getItem('VITE_SUPABASE_URL') || '';
  const localKey = localStorage.getItem('VITE_SUPABASE_ANON_KEY') || '';
  
  const supabaseUrl = localUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = localKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return { supabaseUrl, supabaseAnonKey };
};

const checkValidConfig = (url: string, key: string) => {
  return !!(
    url &&
    key &&
    !url.includes('your-supabase') &&
    !key.includes('your-supabase') &&
    url.startsWith('https://') &&
    key.length > 20
  );
};

const credentials = getSupabaseCredentials();
let supabaseClient: any;
let isValidConfig = checkValidConfig(credentials.supabaseUrl, credentials.supabaseAnonKey);

const createChainableProxy = (): any => {
  const handler: ProxyHandler<any> = {
    get: (_target, prop) => {
      if (prop === 'then') return undefined;
      return (..._args: any[]) => createChainableProxy();
    },
    apply: () => createChainableProxy(),
  };
  return new Proxy(function () {}, handler);
};

const getProxyClient = () => {
  return new Proxy({}, {
    get: (_target, prop) => {
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
      if (prop === 'channel') {
        return () => ({
          on: function () { return this; },
          subscribe: () => ({ unsubscribe: () => {} }),
        });
      }
      if (prop === 'removeChannel') {
        return () => {};
      }
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
      return createChainableProxy();
    },
  });
};

if (!isValidConfig) {
  console.warn('Supabase credentials are missing. Falling back to local preview mode.');
  supabaseClient = getProxyClient();
} else {
  try {
    supabaseClient = createClient(credentials.supabaseUrl, credentials.supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    supabaseClient = getProxyClient();
  }
}

// Exportable holder that stays reactive if updated
export const supabase = {
  get auth() { return supabaseClient.auth; },
  get storage() { return supabaseClient.storage; },
  channel(...args: any[]) { return supabaseClient.channel(...args); },
  removeChannel(channel: any) { return supabaseClient.removeChannel(channel); },
  from(relation: string) { return supabaseClient.from(relation); },
};

export const hasSupabaseConfig = () => {
  const creds = getSupabaseCredentials();
  return checkValidConfig(creds.supabaseUrl, creds.supabaseAnonKey);
};

export const updateSupabaseCredentials = (url: string, key: string) => {
  localStorage.setItem('VITE_SUPABASE_URL', url.trim());
  localStorage.setItem('VITE_SUPABASE_ANON_KEY', key.trim());
  
  const valid = checkValidConfig(url.trim(), key.trim());
  if (valid) {
    supabaseClient = createClient(url.trim(), key.trim());
  } else {
    supabaseClient = getProxyClient();
  }
  return valid;
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('VITE_SUPABASE_URL');
  localStorage.removeItem('VITE_SUPABASE_ANON_KEY');
  supabaseClient = getProxyClient();
};
