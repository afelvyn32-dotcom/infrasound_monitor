import InfrasoundEvent from '../models/InfrasoundEvent.js';
import Alert from '../models/Alert.js';
import { InfrasoundFilter, StaLtaDetector, estimateDominantFrequency, classifyInfrasoundSignature } from '../utils/signalProcessing.js';
import { broadcastAlert, broadcastEventDetected } from '../config/socket.js';

// In-memory runtime state per active sensor
const sensorDetectors = new Map();
const activeEvents = new Map();

export class SensorDetectorSession {
  constructor(sensor) {
    this.sensorId = sensor.sensorId;
    this.fs = sensor.samplingRateHz || 20;
    this.filter = new InfrasoundFilter(this.fs);
    
    const th = sensor.thresholds || {};
    this.staLta = new StaLtaDetector(
      this.fs,
      th.staWindowSec || 2,
      th.ltaWindowSec || 20,
      th.triggerRatio || 3.5,
      th.detriggerRatio || 1.5
    );

    this.sampleBuffer = []; // Rolling buffer for frequency estimation
    this.currentEvent = null;
  }

  updateThresholds(th) {
    if (th.triggerRatio) this.staLta.triggerRatio = th.triggerRatio;
    if (th.detriggerRatio) this.staLta.detriggerRatio = th.detriggerRatio;
  }

  async processIncomingPacket(samples) {
    const processedSamples = [];
    let maxRatioInPacket = 0;
    let latestRatio = 1.0;
    let peakDelta = 0;

    for (const sample of samples) {
      // 1. Filter raw barometric pressure into infrasonic delta P (Pa)
      const deltaP = sample.pressurePa !== undefined 
        ? sample.pressurePa 
        : this.filter.filterSample(sample.rawPressure || 101325);

      // 2. Feed into STA/LTA detector
      const detection = this.staLta.processSample(deltaP);
      latestRatio = detection.ratio;
      if (detection.ratio > maxRatioInPacket) maxRatioInPacket = detection.ratio;
      if (Math.abs(deltaP) > Math.abs(peakDelta)) peakDelta = deltaP;

      processedSamples.push({
        offsetMs: sample.offsetMs,
        pressurePa: deltaP,
        rawPressure: sample.rawPressure,
        ratio: detection.ratio,
        isTriggered: detection.isTriggered
      });

      // Keep sample buffer for frequency analysis (last 200 samples)
      this.sampleBuffer.push(deltaP);
      if (this.sampleBuffer.length > 200) this.sampleBuffer.shift();

      // 3. Handle Event Trigger (Rising Edge)
      if (detection.isNewEvent && !this.currentEvent) {
        await this.handleEventStart(deltaP, detection.ratio);
      }

      // Update peak during active event
      if (this.currentEvent) {
        if (Math.abs(deltaP) > this.currentEvent.peakAmplitudePa) {
          this.currentEvent.peakAmplitudePa = Number(Math.abs(deltaP).toFixed(3));
        }
        this.currentEvent.waveformSnapshot.push({
          offsetMs: Date.now() - this.currentEvent.startTime.getTime(),
          pressurePa: deltaP
        });
        // Cap snapshot size
        if (this.currentEvent.waveformSnapshot.length > 300) {
          this.currentEvent.waveformSnapshot.shift();
        }
      }

      // 4. Handle Event Detrigger (Falling Edge)
      if (detection.isEventEnded && this.currentEvent) {
        await this.handleEventEnd();
      }
    }

    return {
      processedSamples,
      latestRatio,
      maxRatioInPacket,
      isTriggered: this.staLta.isTriggered
    };
  }

  async handleEventStart(initialAmplitude, triggerRatio) {
    try {
      const eventId = `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const dominantFreq = estimateDominantFrequency(this.sampleBuffer, this.fs);

      const newEvent = new InfrasoundEvent({
        eventId,
        sensorId: this.sensorId,
        startTime: new Date(),
        peakAmplitudePa: Number(Math.abs(initialAmplitude).toFixed(3)),
        dominantFrequencyHz: dominantFreq,
        staLtaRatio: triggerRatio,
        detectionMethod: 'STA_LTA',
        classification: 'UNCLASSIFIED',
        status: 'DETECTED',
        waveformSnapshot: [{ offsetMs: 0, pressurePa: initialAmplitude }]
      });

      this.currentEvent = newEvent;
      await newEvent.save();

      // Severity classification based on peak amplitude
      let severity = 'MEDIUM';
      if (Math.abs(initialAmplitude) > 10.0 || triggerRatio > 6.0) severity = 'CRITICAL';
      else if (Math.abs(initialAmplitude) > 5.0 || triggerRatio > 4.5) severity = 'HIGH';

      // Create Alert
      const alertId = `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const alert = new Alert({
        alertId,
        eventId: newEvent.eventId,
        sensorId: this.sensorId,
        severity,
        title: `Infrasound Anomaly on ${this.sensorId}`,
        message: `STA/LTA trigger ratio ${triggerRatio} reached with acoustic pressure ${initialAmplitude} Pa.`,
        peakAmplitudePa: Math.abs(initialAmplitude)
      });

      await alert.save();

      // Broadcast alerts to all frontend listeners
      broadcastAlert(alert);
      broadcastEventDetected(newEvent);
      console.log(`[Detector] Infrasound Event ${eventId} triggered on sensor ${this.sensorId}`);
    } catch (err) {
      console.error('[Detector] Error starting event:', err.message);
    }
  }

  async handleEventEnd() {
    try {
      if (!this.currentEvent) return;
      
      const endTime = new Date();
      const durationSec = Number(((endTime.getTime() - this.currentEvent.startTime.getTime()) / 1000).toFixed(2));
      const dominantFreq = estimateDominantFrequency(this.sampleBuffer, this.fs);
      const classification = classifyInfrasoundSignature(this.currentEvent.peakAmplitudePa, dominantFreq, durationSec);

      this.currentEvent.endTime = endTime;
      this.currentEvent.durationSec = durationSec;
      this.currentEvent.dominantFrequencyHz = dominantFreq;
      this.currentEvent.classification = classification;

      await this.currentEvent.save();
      console.log(`[Detector] Event ${this.currentEvent.eventId} resolved. Duration: ${durationSec}s, Class: ${classification}`);
      this.currentEvent = null;
    } catch (err) {
      console.error('[Detector] Error resolving event:', err.message);
      this.currentEvent = null;
    }
  }
}

export const getOrCreateDetectorSession = (sensor) => {
  if (!sensorDetectors.has(sensor.sensorId)) {
    sensorDetectors.set(sensor.sensorId, new SensorDetectorSession(sensor));
  }
  return sensorDetectors.get(sensor.sensorId);
};
