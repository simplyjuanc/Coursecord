import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./singleton.ts'],
    verbose: true,
  };
};
