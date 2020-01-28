const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user.controller');


//router.get('/test', user_controller.test);

router.post('/create', user_controller.user_create);
router.post('/edit', user_controller.user_edit);
router.post('/isadmin', user_controller.isadmin);
router.post('/getUserById', user_controller.get_user_by_id);
router.post('/getAllUsers', user_controller.get_all_users);
router.post('/getUserByName', user_controller.get_user_by_name);
router.post('/delete', user_controller.user_delete);
router.post('/editMyUser', user_controller.edit_my_user);
router.post('/getMyId', user_controller.get_my_id);


module.exports = router;
