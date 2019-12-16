const express = require('express');
const router = express.Router();
const issue_controller = require('../controllers/issue.controller');

router.post('/create', issue_controller.issue_create);
router.post('/get', issue_controller.getissue);

module.exports = router;
