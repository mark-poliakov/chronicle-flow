export default {
  '*.{ts,tsx,js,jsx,json,css}': ['prettier --check', () => 'npm run build'],
  '*.{ts,tsx}': ['eslint --max-warnings 0'],
};
