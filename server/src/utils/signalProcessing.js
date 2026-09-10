/**
 * Infrasound Signal Processing & Algorithm Utilities
 * Atmospheric acoustic wave analysis (< 20 Hz)
 */

export class InfrasoundFilter {
  constructor(samplingRateHz = 20) {
    this.fs = samplingRateHz;
    // Exponential baseline tracking constant (removes static ~101,325 Pa & diurnal weather drift)
    this.alpha = 0.98;
    this.baseline = 101325.0; // Default baseline in Pascals
    this.isInitialized = false;
  }

  /**
   * Filter raw barometric pressure into dynamic infrasonic acoustic perturbation (in Pascals)
   * @param {number} rawPressurePa Raw reading from BMP280/BMP388 in Pascals
   * @returns {number} Delta P in Pascals (e.g. -2.5 Pa to +5.0 Pa)
   */
  filterSample(rawPressurePa) {
    if (!this.isInitialized) {
      this.baseline = rawPressurePa;
      this.isInitialized = true;
      return 0.0;
    }

    // Slow exponential moving average for diurnal atmospheric pressure
    this.baseline = this.alpha * this.baseline + (1.0 - this.alpha) * rawPressurePa;
    
    // Infrasonic acoustic perturbation: difference from baseline
    const deltaPressure = rawPressurePa - this.baseline;
    return Number(deltaPressure.toFixed(4));
  }
}

/**
 * Continuous STA/LTA (Short-Term Average / Long-Term Average) Detector
 * Widely used in seismology and CTBTO infrasound monitoring stations.
 */
export class StaLtaDetector {
  /**
   * @param {number} samplingRateHz (e.g. 20 Hz)
   * @param {number} staSeconds (e.g. 2s)
   * @param {number} ltaSeconds (e.g. 20s)
   * @param {number} triggerRatio (e.g. 3.5)
   * @param {number} detriggerRatio (e.g. 1.5)
   */
  constructor(samplingRateHz = 20, staSeconds = 2, ltaSeconds = 20, triggerRatio = 3.5, detriggerRatio = 1.5) {
    this.fs = samplingRateHz;
    this.staSamples = Math.max(1, Math.round(staSeconds * samplingRateHz));
    this.ltaSamples = Math.max(1, Math.round(ltaSeconds * samplingRateHz));
    this.triggerRatio = triggerRatio;
    this.detriggerRatio = detriggerRatio;

    this.sta = 0.05; // Initial energy seed
    this.lta = 0.05;
    this.isTriggered = false;
  }

  /**
   * Process a single filtered delta-pressure sample
   * @param {number} deltaPressurePa Pressure deviation in Pascals
   * @returns {object} { ratio, isTriggered, isNewEvent, isEventEnded, sta, lta }
   */
  processSample(deltaPressurePa) {
    // Characteristic Function (CF): Squared instantaneous acoustic energy
    const cf = deltaPressurePa * deltaPressurePa;

    // Recursive updating for continuous time series
    this.sta = this.sta + (cf - this.sta) / this.staSamples;
    this.lta = this.lta + (cf - this.lta) / this.ltaSamples;

    // Guard against division by zero
    const currentLta = Math.max(this.lta, 0.001);
    const ratio = Number((this.sta / currentLta).toFixed(2));

    let isNewEvent = false;
    let isEventEnded = false;

    if (!this.isTriggered && ratio >= this.triggerRatio) {
      this.isTriggered = true;
      isNewEvent = true;
    } else if (this.isTriggered && ratio <= this.detriggerRatio) {
      this.isTriggered = false;
      isEventEnded = true;
    }

    return {
      ratio,
      isTriggered: this.isTriggered,
      isNewEvent,
      isEventEnded,
      sta: Number(this.sta.toFixed(4)),
      lta: Number(this.lta.toFixed(4))
    };
  }
}

/**
 * Estimate dominant frequency using zero-crossing rate approximation
 * @param {Array<number>} samples Array of delta-pressure values
 * @param {number} samplingRateHz
 * @returns {number} Frequency in Hertz (0.01 - 20 Hz)
 */
export const estimateDominantFrequency = (samples, samplingRateHz = 20) => {
  if (!samples || samples.length < 4) return 1.0;
  let zeroCrossings = 0;
  for (let i = 1; i < samples.length; i++) {
    if ((samples[i] >= 0 && samples[i - 1] < 0) || (samples[i] < 0 && samples[i - 1] >= 0)) {
      zeroCrossings++;
    }
  }
  const durationSec = samples.length / samplingRateHz;
  if (durationSec === 0) return 1.0;
  const freq = (zeroCrossings / 2) / durationSec;
  return Number(Math.max(0.05, Math.min(20.0, freq)).toFixed(2));
};

/**
 * Infer event classification based on acoustic signature
 * @param {number} peakAmplitude Peak delta pressure in Pa
 * @param {number} dominantFreq Estimated frequency in Hz
 * @param {number} durationSec Event duration
 */
export const classifyInfrasoundSignature = (peakAmplitude, dominantFreq, durationSec) => {
  if (peakAmplitude > 12.0 && dominantFreq > 3.0 && durationSec < 8.0) {
    return 'EXPLOSION';
  } else if (dominantFreq <= 1.5 && durationSec > 10.0) {
    return 'SEISMIC';
  } else if (dominantFreq < 0.8 && durationSec > 20.0) {
    return 'SEVERE_WEATHER';
  } else if (peakAmplitude > 8.0 && dominantFreq >= 1.0 && dominantFreq <= 3.0) {
    return 'VOLCANIC';
  }
  return 'UNCLASSIFIED';
};
