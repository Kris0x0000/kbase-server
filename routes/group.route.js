const express = require('express');
const router = express.Router();

const group_controller = require('../controllers/group.controller');

router.post("/create", group_controller.createGroup);
router.post("/getallgroups", group_controller.GetAllGroups);
router.post("updategroup", group_controller.UpdateGroup);



module.exports = router;
