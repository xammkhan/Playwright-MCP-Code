import dotenv from 'dotenv';

dotenv.config();

export function getEnvVar(key: string, fallback = ''): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Environment variable ${key} is required but was not provided.`);
  }
  return value;
}

export const credentials = {
  baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
  username: getEnvVar('USERNAME', 'standard_user'),
  password: getEnvVar('PASSWORD', 'secret_sauce'),
  firstName: getEnvVar('FIRST_NAME', 'John'),
  lastName: getEnvVar('LAST_NAME', 'Doe'),
  postalCode: getEnvVar('ZIP_CODE', '12345'),
};
