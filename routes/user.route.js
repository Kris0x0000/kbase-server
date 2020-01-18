const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user.controller');


//router.get('/test', user_controller.test);

router.post('/create', user_controller.user_create);
router.post('/isadmin', user_controller.isadmin);
router.get('/:id', user_controller.get_user_by_id);
router.post('/getAllUsers', user_controller.get_all_users);
router.post('/getUserByName', user_controller.get_user_by_name);

module.exports = router;
