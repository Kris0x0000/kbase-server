const express = require('express');
const router = express.Router();

const problem_controller = require('../controllers/problem.controller');


router.post('/create', problem_controller.problem_create);

//router.get('/:id', problem_controller.problem_details);

module.exports = router;
