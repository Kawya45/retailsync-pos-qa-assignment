// Test configuration is read from environment variables (see .env.example).
// No credentials or environment-specific IDs are stored in the repository.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and fill in the values.`
    );
  }
  return value;
}

// Super admin account used to log in before each test
export const ADMIN_EMAIL = requireEnv('ADMIN_EMAIL');
export const ADMIN_PASSWORD = requireEnv('ADMIN_PASSWORD');

// MongoDB ObjectIds that exist in the test database
export const EMPLOYEE_ROLE_ID = requireEnv('EMPLOYEE_ROLE_ID');
export const BRANCH_ID = requireEnv('BRANCH_ID');

// An email that already exists in the system (used by the duplicate-email test)
export const EXISTING_USER_EMAIL = process.env.EXISTING_USER_EMAIL ?? 'admin@retailsync.com';

// Throwaway password for users created by the tests (test data, not a real credential)
export const NEW_USER_PASSWORD = 'Test@1234';
