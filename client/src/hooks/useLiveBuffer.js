import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

export const useLiveBuffer = (sensorId, maxBufferSize = 120) => {
  const { socket, isConnected, subscribeToSensor, unsubscribeFromSensor } = useSocket();
  const [dataPoints, setDataPoints] = useState([]);
  const [latestStats, setLatestStats] = useState({
    pressurePa: 0.0,
    rawPressure: 1013.25,
    ratio: 1.0,
    isTriggered: false,
    peakAmplitude: 0.0,
    packetCount: 0,
    lastUpdate: null,
    battery: 100,
    rssi: -60
  });

  const bufferRef = useRef([]);

  useEffect(() => {
    if (!sensorId || !socket) return;

    // Reset buffer when sensor changes
    bufferRef.current = [];
    setDataPoints([]);

    subscribeToSensor(sensorId);

    const handlePacket = (packet) => {
      if (packet.sensorId !== sensorId) return;

      const baseTime = packet.timestamp;
      const samples = packet.samples || [];

      let peakInPacket = 0;
      let lastDeltaP = 0;
      let lastRawP = 1013.25;

      samples.forEach((sample, idx) => {
        const pointTime = new Date(baseTime + (sample.offsetMs || idx * 50)).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          fractionalSecondDigits: 2
        });

        const point = {
          time: pointTime,
          timestamp: baseTime + (sample.offsetMs || idx * 50),
          pressurePa: sample.pressurePa,
          rawPressure: sample.rawPressure,
          ratio: sample.ratio || packet.latestRatio || 1.0,
          isTriggered: sample.isTriggered || packet.isTriggered || false
        };

        lastDeltaP = sample.pressurePa;
        if (sample.rawPressure) lastRawP = sample.rawPressure;
        if (Math.abs(sample.pressurePa) > Math.abs(peakInPacket)) {
          peakInPacket = sample.pressurePa;
        }

        bufferRef.current.push(point);
      });

      // Keep sliding window to maxBufferSize
      if (bufferRef.current.length > maxBufferSize) {
        bufferRef.current = bufferRef.current.slice(-maxBufferSize);
      }

      setDataPoints([...bufferRef.current]);

      setLatestStats(prev => ({
        pressurePa: lastDeltaP,
        rawPressure: lastRawP,
        ratio: packet.latestRatio || 1.0,
        isTriggered: packet.isTriggered || false,
        peakAmplitude: Math.max(Math.abs(peakInPacket), prev.isTriggered ? prev.peakAmplitude : Math.abs(peakInPacket)),
        packetCount: prev.packetCount + 1,
        lastUpdate: new Date(),
        battery: packet.battery ?? prev.battery,
        rssi: packet.rssi ?? prev.rssi
      }));
    };

    socket.on('telemetry:packet', handlePacket);

    return () => {
      socket.off('telemetry:packet', handlePacket);
      unsubscribeFromSensor(sensorId);
    };
  }, [sensorId, socket, isConnected, maxBufferSize]);

  return {
    dataPoints,
    latestStats,
    isStreaming: isConnected && latestStats.packetCount > 0
  };
};
