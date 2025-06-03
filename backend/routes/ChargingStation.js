const express = require('express');
const ChargingStation = require('../models/ChargingStation');
const router = express.Router();

// Get all charging stations
router.get('/', async (req, res) => {
  try {
    const { status, minPower, connectorType } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (minPower) filter.powerOutput = { $gte: Number(minPower) };
    if (connectorType) filter.connectorType = connectorType;
    
    const stations = await ChargingStation.find(filter).populate('createdBy', 'username');
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get nearby charging stations
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const stations = await ChargingStation.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(maxDistance)
        }
      }
    });

    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new charging station
router.post('/', async (req, res) => {
  try {
    const { name, lat, lng, status, powerOutput, connectorType } = req.body;
    
    const station = new ChargingStation({
      name,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      status,
      powerOutput,
      connectorType,
      createdBy: req.user._id
    });

    await station.save();
    res.status(201).json(station);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update charging station
router.put('/:id', async (req, res) => {
  try {
    const { name, lat, lng, status, powerOutput, connectorType } = req.body;
    
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    // Check if user is the creator
    if (station.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this station' });
    }

    station.name = name || station.name;
    if (lat && lng) {
      station.location.coordinates = [parseFloat(lng), parseFloat(lat)];
    }
    station.status = status || station.status;
    station.powerOutput = powerOutput || station.powerOutput;
    station.connectorType = connectorType || station.connectorType;

    await station.save();
    res.json(station);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete charging station
router.delete('/:id', async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    // Check if user is the creator
    if (station.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this station' });
    }

    await station.remove();
    res.json({ message: 'Station deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;