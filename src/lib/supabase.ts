import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

// Create the client with default configuration
const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'digital-signage-manager'
    }
  }
});

// Add retry mechanism to auth operations
const withRetry = async <T>(
  operation: () => Promise<T>,
  retryCount = 0
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retryCount < MAX_RETRIES && error instanceof Error && error.message.includes('Failed to fetch')) {
      console.log(`Retrying operation (${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return withRetry(operation, retryCount + 1);
    }
    throw error;
  }
};

// Enhance auth methods with retry mechanism
const auth = {
  ...supabaseClient.auth,
  signInWithPassword: async (credentials: {
    email: string;
    password: string;
  }) => {
    return withRetry(() => supabaseClient.auth.signInWithPassword(credentials));
  }
};

export { supabaseClient as supabase, auth };
export default supabaseClient;