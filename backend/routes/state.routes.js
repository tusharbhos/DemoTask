const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const stateController = require('../controllers/state.controller');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');

const stateValidation = [
  body('state_name')
    .trim()
    .notEmpty().withMessage('State name is required')
    .isLength({ min: 2, max: 100 }).withMessage('State name must be between 2 and 100 characters'),
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
];

// All routes require authentication
router.use(authMiddleware);

router.get('/all-active', stateController.getAllActiveStates);
router.get('/',           stateController.getStates);
router.get('/:id',        stateController.getStateById);
router.post('/',          stateValidation, validate, stateController.createState);
router.put('/:id',        stateValidation, validate, stateController.updateState);
router.delete('/:id',     stateController.deleteState);

module.exports = router;
