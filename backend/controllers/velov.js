const Velov = require('../models/velov');
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'opencage',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: '89631b453704442aaa57f9650760f8b7', // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);
exports.getVelovCoord = (req, res, next) => {
  Velov.find({
    geometry: {
      $near: {
        $maxDistance: 1000,
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
        }
      }
    }
  }).find((err, results) => {
    if (err) {
      return res.status(500).json({
        message: err
      });
    }
    return res.status(200).json(results);
  });
};

exports.getVelov = (req, res, next) => {
  let latitude;
  let longitude;
  geocoder
    .geocode({ address: req.query.address, country: 'France' })
    .then(function(place) {
      place.forEach(response => {
        if ((response.county === 'Lyon') | (response.county === 'Rhône')) {
          (latitude = response.latitude), (longitude = response.longitude);
        }
      });
      Velov.find({
        geometry: {
          $near: {
            $maxDistance: 1000,
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
          }
        }
      }).find((err, results) => {
        if (err) {
          return res.status(500).json({
            message: err
          });
        }
        return res.status(200).json(results);
      });
    })
    .catch(function(err) {
      return res.status(500).json({
        message: err
      });
    });
};
