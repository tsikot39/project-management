// Simple toast notification system
interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

class ToastManager {
  private toasts: Array<ToastOptions & { id: string; timestamp: number }> = [];
  private listeners: Array<(toasts: typeof this.toasts) => void> = [];

  show(message: string, type: ToastOptions['type'] = 'info', duration = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, message, type, duration, timestamp: Date.now() };

    this.toasts.push(toast);
    this.notifyListeners();

    // Auto remove after duration
    setTimeout(() => {
      this.remove(id);
    }, duration);

    return id;
  }

  success(message: string, duration?: number) {
    return this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    return this.show(message, 'error', duration);
  }

  info(message: string, duration?: number) {
    return this.show(message, 'info', duration);
  }

  warning(message: string, duration?: number) {
    return this.show(message, 'warning', duration);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notifyListeners();
  }

  clear() {
    this.toasts = [];
    this.notifyListeners();
  }

  subscribe(listener: (toasts: typeof this.toasts) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.toasts]));
  }

  getToasts() {
    return [...this.toasts];
  }
}

export const toast = new ToastManager();
