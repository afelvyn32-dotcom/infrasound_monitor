import Sensor from '../models/Sensor.js';
import { getOrCreateDetectorSession } from '../services/detectorService.js';

export const getSensors = async (req, res, next) => {
  try {
    const sensors = await Sensor.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: sensors.length,
      data: sensors
    });
  } catch (error) {
    next(error);
  }
};

export const getSensorById = async (req, res, next) => {
  try {
    const sensor = await Sensor.findOne({ sensorId: req.params.id });
    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found.' });
    }
    res.status(200).json({ success: true, data: sensor });
  } catch (error) {
    next(error);
  }
};

export const createSensor = async (req, res, next) => {
  try {
    const { sensorId, name, location, apiKey, samplingRateHz, thresholds } = req.body;

    const existing = await Sensor.findOne({ sensorId });
    if (existing) {
      return res.status(400).json({ success: false, message: `Sensor ID '${sensorId}' is already registered.` });
    }

    const sensor = await Sensor.create({
      sensorId,
      name,
      location,
      apiKey: apiKey || `key_${Math.random().toString(36).substr(2, 9)}`,
      samplingRateHz: samplingRateHz || 20,
      thresholds: thresholds || {},
      status: 'OFFLINE'
    });

    res.status(201).json({
      success: true,
      message: 'Sensor registered successfully.',
      data: sensor
    });
  } catch (error) {
    next(error);
  }
};

export const updateSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findOneAndUpdate(
      { sensorId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found.' });
    }

    // Refresh active detector thresholds in memory
    const session = getOrCreateDetectorSession(sensor);
    if (req.body.thresholds) {
      session.updateThresholds(req.body.thresholds);
    }

    res.status(200).json({
      success: true,
      message: 'Sensor updated successfully.',
      data: sensor
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findOneAndDelete({ sensorId: req.params.id });
    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Sensor '${req.params.id}' deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};
