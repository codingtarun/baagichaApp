/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — TOAST STORE
 * ═══════════════════════════════════════════════════════════════
 *
 * Global toast notifications using Zustand.
 *
 * Usage:
 *   import { showToast, hideToast } from './toastStore';
 *
 *   showToast({ message: 'Registration successful!', type: 'success' });
 *   showToast({ message: 'Something went wrong', type: 'error' });
 *   showToast({ message: 'Please check your input', type: 'warning' });
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number; // ms
  show: (payload: { message: string; type?: ToastType; duration?: number }) => void;
  hide: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 3000,

  show: ({ message, type = 'info', duration = 3000 }) => {
    set({ visible: true, message, type, duration });
  },

  hide: () => {
    set({ visible: false });
  },
}));

// ── Convenience exports ──

export function showToast(
  message: string,
  type: ToastType = 'info',
  duration?: number,
): void {
  useToastStore.getState().show({ message, type, duration });
}

export function hideToast(): void {
  useToastStore.getState().hide();
}
