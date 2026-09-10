import SystemSetting from '../models/SystemSetting.js';
import { setSimulationProfile, getSimulationStatus, startSimulator, stopSimulator } from '../services/simulatorService.js';

export const getSettings = async (req, res, next) => {
  try {
    const settings = await SystemSetting.find();
    const simStatus = getSimulationStatus();

    res.status(200).json({
      success: true,
      simulationStatus: simStatus,
      settings
    });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { key, value, description } = req.body;

    const setting = await SystemSetting.findOneAndUpdate(
      { key },
      { value, description, updatedBy: req.user.id },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: `Setting '${key}' updated.`,
      data: setting
    });
  } catch (error) {
    next(error);
  }
};

export const triggerSimulationEvent = async (req, res, next) => {
  try {
    const { profile } = req.body; // 'EXPLOSION', 'SEISMIC', 'SEVERE_WEATHER', 'NORMAL'

    if (!['EXPLOSION', 'SEISMIC', 'SEVERE_WEATHER', 'NORMAL'].includes(profile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid simulation profile. Choose EXPLOSION, SEISMIC, SEVERE_WEATHER, or NORMAL.'
      });
    }

    const state = setSimulationProfile(profile);

    res.status(200).json({
      success: true,
      message: `Simulator profile updated to ${profile}. Transient wave injection active!`,
      data: state
    });
  } catch (error) {
    next(error);
  }
};

export const toggleSimulatorRunning = async (req, res, next) => {
  try {
    const { enable } = req.body;
    if (enable) {
      await startSimulator();
    } else {
      stopSimulator();
    }

    res.status(200).json({
      success: true,
      message: `Simulator ${enable ? 'started' : 'paused'}.`,
      simulationStatus: getSimulationStatus()
    });
  } catch (error) {
    next(error);
  }
};
