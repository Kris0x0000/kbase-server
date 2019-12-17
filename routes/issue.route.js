const express = require('express');
const router = express.Router();
const issue_controller = require('../controllers/issue.controller');

router.post('/create', issue_controller.issue_create);
router.post('/getByTag', issue_controller.getIssueByTag);
router.post('/getIssueById', issue_controller.getIssueById);

module.exports = router;
