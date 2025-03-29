import { FlatCompat } from '@eslint/eslintrc';
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web-vitals', 'prettier', 'next/typescript', 'next'],
    rules: {
      semi: ['error'],
    },
    settings: {
      next: {
        rootDir: 'packages/my-app/',
      },
    },
  }),
];
export default eslintConfig;
