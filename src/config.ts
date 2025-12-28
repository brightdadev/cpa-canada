// 1. Centralize all Environment Variables here.
// This is the ONLY file that touches "import.meta.env" or "VITE_" tags.

const getEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    console.warn(`⚠️ Missing Environment Variable: ${key}`);
    return '';
  }
  return value;
};

export const Config = {
  Supabase: {
    Url: getEnv('VITE_SUPABASE_URL'),
    AnonKey: getEnv('VITE_SUPABASE_ANON_KEY'),
  },
  Firebase: {
    ApiKey: getEnv('VITE_FIREBASE_API_KEY'),
    AuthDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    ProjectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
    StorageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    MessagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    AppId: getEnv('VITE_FIREBASE_APP_ID'),
  },
  Stripe: {
    PublicKey: getEnv('VITE_STRIPE_PUBLIC_KEY'),
  }
};
