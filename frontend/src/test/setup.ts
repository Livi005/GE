import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { useAuthStore } from '../store/authStore';
beforeEach(() => { localStorage.clear(); useAuthStore.setState({ token: null, role: null, userName: null, institutionId: null, isDean: false, theme: 'light' }); });
afterEach(cleanup);
