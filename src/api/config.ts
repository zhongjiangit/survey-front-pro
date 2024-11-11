export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://8.137.101.138:29090'
    : '/server-api';

export const isProd = process.env.NODE_ENV === 'production';
