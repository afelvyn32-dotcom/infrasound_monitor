import Report from '../models/Report.js';
import InfrasoundEvent from '../models/InfrasoundEvent.js';
import { generateSummaryReport, exportEventsToCSV } from '../services/reportService.js';

export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .populate('generatedBy', 'name email');

    res.status(200).json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

export const createReport = async (req, res, next) => {
  try {
    const { title, fromDate, toDate, format, sensors } = req.body;

    const { report } = await generateSummaryReport({
      userId: req.user.id,
      title,
      fromDate,
      toDate,
      format,
      sensors: sensors || []
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully.',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const downloadEventsCSV = async (req, res, next) => {
  try {
    const { from, to, sensorId } = req.query;
    const query = {};
    if (from || to) {
      query.startTime = {};
      if (from) query.startTime.$gte = new Date(from);
      if (to) query.startTime.$lte = new Date(to);
    }
    if (sensorId) query.sensorId = sensorId;

    const events = await InfrasoundEvent.find(query).sort({ startTime: -1 });
    const csvContent = exportEventsToCSV(events);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=infrasound_events_${Date.now()}.csv`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};
