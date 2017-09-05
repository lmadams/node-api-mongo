

const express = require('express');

const router = express.Router();
const controller = require('../controllers/customer-controller');
const authService = require('../auth-service');

router.post('/', controller.post);
router.post('/authenticate', controller.authenticate);
router.post('/refresh-token', authService.authorize, controller.refreshToken);

module.exports = router;
