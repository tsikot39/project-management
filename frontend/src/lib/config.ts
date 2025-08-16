const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000,
  },
  socket: {
    url: SOCKET_URL,
    options: {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    },
  },
  app: {
    name: 'Project Management Platform',
    version: '1.0.0',
  },
  storage: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    userKey: 'user_data',
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  validation: {
    minPasswordLength: 8,
    maxNameLength: 100,
    maxDescriptionLength: 500,
  },
};
