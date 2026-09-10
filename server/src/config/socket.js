import { Server } from 'socket.io';

let ioInstance = null;

export const initSocket = (httpServer, clientUrl) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join specific sensor live stream room
    socket.on('subscribe:sensor', ({ sensorId }) => {
      if (sensorId) {
        const room = `sensor:${sensorId}`;
        socket.join(room);
        console.log(`[Socket.IO] Client ${socket.id} subscribed to ${room}`);
      }
    });

    // Leave sensor room
    socket.on('unsubscribe:sensor', ({ sensorId }) => {
      if (sensorId) {
        const room = `sensor:${sensorId}`;
        socket.leave(room);
        console.log(`[Socket.IO] Client ${socket.id} unsubscribed from ${room}`);
      }
    });

    // Join global alert feed
    socket.on('subscribe:alerts', () => {
      socket.join('global:alerts');
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO has not been initialized!');
  }
  return ioInstance;
};

// Real-time broadcast helpers
export const broadcastTelemetryPacket = (sensorId, packet) => {
  if (!ioInstance) return;
  ioInstance.to(`sensor:${sensorId}`).emit('telemetry:packet', packet);
  // Also emit to general telemetry room for admin overview
  ioInstance.to('admin:telemetry').emit('telemetry:packet', packet);
};

export const broadcastEventDetected = (eventData) => {
  if (!ioInstance) return;
  ioInstance.emit('event:detected', eventData);
};

export const broadcastAlert = (alertData) => {
  if (!ioInstance) return;
  ioInstance.to('global:alerts').emit('alert:new', alertData);
  ioInstance.emit('alert:new', alertData); // Broadcast to all connected clients
};
