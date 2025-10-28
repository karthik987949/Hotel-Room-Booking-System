import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        const socket = new SockJS('http://localhost:8080/api/ws');
        this.stompClient = Stomp.over(socket);
        
        // Disable debug logging
        this.stompClient.debug = () => {};

        this.stompClient.connect({}, 
          (frame) => {
            console.log('WebSocket Connected: ' + frame);
            this.connected = true;
            resolve(frame);
          },
          (error) => {
            console.error('WebSocket Connection Error: ', error);
            this.connected = false;
            reject(error);
          }
        );
      } catch (error) {
        console.error('WebSocket Setup Error: ', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      // Unsubscribe from all topics
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      
      this.stompClient.disconnect();
      this.connected = false;
      console.log('WebSocket Disconnected');
    }
  }

  subscribeToHotelUpdates(callback) {
    if (!this.connected) {
      console.warn('WebSocket not connected. Cannot subscribe to hotel updates.');
      return null;
    }

    const subscription = this.stompClient.subscribe('/topic/hotel-updates', (message) => {
      try {
        const notification = JSON.parse(message.body);
        callback(notification);
      } catch (error) {
        console.error('Error parsing hotel update notification:', error);
      }
    });

    this.subscriptions.set('hotel-updates', subscription);
    return subscription;
  }

  subscribeToPriceUpdates(callback) {
    if (!this.connected) {
      console.warn('WebSocket not connected. Cannot subscribe to price updates.');
      return null;
    }

    const subscription = this.stompClient.subscribe('/topic/price-updates', (message) => {
      try {
        const notification = JSON.parse(message.body);
        callback(notification);
      } catch (error) {
        console.error('Error parsing price update notification:', error);
      }
    });

    this.subscriptions.set('price-updates', subscription);
    return subscription;
  }

  subscribeToImageUpdates(callback) {
    if (!this.connected) {
      console.warn('WebSocket not connected. Cannot subscribe to image updates.');
      return null;
    }

    const subscription = this.stompClient.subscribe('/topic/image-updates', (message) => {
      try {
        const notification = JSON.parse(message.body);
        callback(notification);
      } catch (error) {
        console.error('Error parsing image update notification:', error);
      }
    });

    this.subscriptions.set('image-updates', subscription);
    return subscription;
  }

  subscribeToAvailabilityUpdates(callback) {
    if (!this.connected) {
      console.warn('WebSocket not connected. Cannot subscribe to availability updates.');
      return null;
    }

    const subscription = this.stompClient.subscribe('/topic/availability-updates', (message) => {
      try {
        const notification = JSON.parse(message.body);
        callback(notification);
      } catch (error) {
        console.error('Error parsing availability update notification:', error);
      }
    });

    this.subscriptions.set('availability-updates', subscription);
    return subscription;
  }

  unsubscribe(topic) {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  isConnected() {
    return this.connected;
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;