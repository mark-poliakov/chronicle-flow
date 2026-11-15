export default {
  '*.{ts,js,json}': [
    'prettier --check',
    'oxlint --max-warnings=0',
    () => 'npm run build',
  ],
};