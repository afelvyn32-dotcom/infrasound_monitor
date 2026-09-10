import Alert from '../models/Alert.js';

export const getAlerts = async (req, res, next) => {
  try {
    const { acknowledged, severity, limit = 50 } = req.query;

    const query = {};
    if (acknowledged !== undefined) query.isAcknowledged = acknowledged === 'true';
    if (severity) query.severity = severity;

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('acknowledgedBy', 'name email');

    const unacknowledgedCount = await Alert.countDocuments({ isAcknowledged: false });

    res.status(200).json({
      success: true,
      count: alerts.length,
      unacknowledgedCount,
      data: alerts
    });
  } catch (error) {
    next(error);
  }
};

export const acknowledgeAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOne({ alertId: req.params.id });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found.' });
    }

    alert.isAcknowledged = true;
    alert.acknowledgedBy = req.user.id;
    alert.acknowledgedAt = new Date();

    await alert.save();

    res.status(200).json({
      success: true,
      message: 'Alert acknowledged.',
      data: alert
    });
  } catch (error) {
    next(error);
  }
};

export const acknowledgeAllAlerts = async (req, res, next) => {
  try {
    await Alert.updateMany(
      { isAcknowledged: false },
      {
        isAcknowledged: true,
        acknowledgedBy: req.user.id,
        acknowledgedAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: 'All alerts marked as acknowledged.'
    });
  } catch (error) {
    next(error);
  }
};
