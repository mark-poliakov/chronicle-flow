export default {
  '*.{ts,js}': [
    'prettier --write',
    'oxlint --max-warnings=0',
    () => 'npm run build',
  ],
  '*.json': [
    'prettier --write',
  ],
};