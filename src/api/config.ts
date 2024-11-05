export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://8.137.101.138:19080'
    : '/server-api';
