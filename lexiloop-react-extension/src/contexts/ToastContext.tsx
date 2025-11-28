import { createContext } from 'react';
import type { ToastType } from '../components/Toast';

export interface ToastData {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: ToastData[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
