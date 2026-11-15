export default {
  '*.{ts,tsx,js,jsx,json,css}': [
    'prettier --check',
    'eslint --max-warnings 0',
    () => 'npm run build',
  ],
};
