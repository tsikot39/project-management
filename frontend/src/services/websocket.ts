// WebSocket service for real-time updates
class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectInterval: number = 5000;
  private maxReconnectAttempts: number = 5;
  private reconnectAttempts: number = 0;
  private listeners: Map<string, Function[]> = new Map();

  connect(orgSlug: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    const wsUrl = `ws://localhost:8000/ws/${orgSlug}`;
    console.log(`Connecting to WebSocket: ${wsUrl}`);

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);

        // Emit to listeners based on message type
        if (data.type && this.listeners.has(data.type)) {
          const callbacks = this.listeners.get(data.type) || [];
          callbacks.forEach((callback) => callback(data.data));
        }

        // Also emit to 'all' listeners
        if (this.listeners.has('all')) {
          const callbacks = this.listeners.get('all') || [];
          callbacks.forEach((callback) => callback(data));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect(orgSlug);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnect(orgSlug: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );

      setTimeout(() => {
        this.connect(orgSlug);
      }, this.reconnectInterval);
    } else {
      console.log('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Subscribe to specific event types
  on(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }

  // Unsubscribe from events
  off(eventType: string, callback: Function) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Send message to server
  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  // Get connection status
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// React hook for using WebSocket in components
import { useEffect, useCallback } from 'react';

export function useWebSocket(orgSlug: string) {
  useEffect(() => {
    websocketService.connect(orgSlug);

    return () => {
      websocketService.disconnect();
    };
  }, [orgSlug]);

  const subscribe = useCallback((eventType: string, callback: Function) => {
    websocketService.on(eventType, callback);

    return () => {
      websocketService.off(eventType, callback);
    };
  }, []);

  const sendMessage = useCallback((message: any) => {
    websocketService.send(message);
  }, []);

  return {
    subscribe,
    sendMessage,
    isConnected: websocketService.isConnected(),
  };
}
