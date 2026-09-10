import InfrasoundEvent from '../models/InfrasoundEvent.js';

export const getEvents = async (req, res, next) => {
  try {
    const { sensorId, classification, status, limit = 50 } = req.query;

    const query = {};
    if (sensorId) query.sensorId = sensorId;
    if (classification) query.classification = classification;
    if (status) query.status = status;

    const events = await InfrasoundEvent.find(query)
      .sort({ startTime: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await InfrasoundEvent.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEventStatus = async (req, res, next) => {
  try {
    const { status, classification, notes } = req.body;

    const event = await InfrasoundEvent.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (status) event.status = status;
    if (classification) event.classification = classification;
    if (notes !== undefined) event.notes = notes;

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

export const getEventStats = async (req, res, next) => {
  try {
    const totalEvents = await InfrasoundEvent.countDocuments();
    const verifiedEvents = await InfrasoundEvent.countDocuments({ status: 'VERIFIED' });
    const classifications = await InfrasoundEvent.aggregate([
      { $group: { _id: '$classification', count: { $sum: 1 } } }
    ]);

    const maxPeak = await InfrasoundEvent.find().sort({ peakAmplitudePa: -1 }).limit(1);

    res.status(200).json({
      success: true,
      stats: {
        totalEvents,
        verifiedEvents,
        classifications,
        maxRecordedPeakPa: maxPeak.length > 0 ? maxPeak[0].peakAmplitudePa : 0
      }
    });
  } catch (error) {
    next(error);
  }
};
