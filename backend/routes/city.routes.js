const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cityController = require('../controllers/city.controller');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

const cityValidation = [
  body('state_id')
    .notEmpty().withMessage('State is required')
    .isInt({ min: 1 }).withMessage('Please select a valid state'),
  body('city_name')
    .trim()
    .notEmpty().withMessage('City name is required')
    .isLength({ min: 2, max: 100 }).withMessage('City name must be between 2 and 100 characters'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
];

// All routes require authentication
router.use(authMiddleware);

router.get('/',      cityController.getCities);
router.get('/:id',   cityController.getCityById);
router.post('/',     cityValidation, validate, cityController.createCity);
router.put('/:id',   cityValidation, validate, cityController.updateCity);
router.delete('/:id', cityController.deleteCity);

module.exports = router;
