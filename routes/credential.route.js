const express = require("express");
const router = express.Router();
const credential_controller = require("../controllers/credential.controller");

router.post("/create", credential_controller.createCredential);
router.post("/update", credential_controller.updateCredential);
router.post("/delete", credential_controller.deleteCredential);
router.post("/getCredentialByTag", credential_controller.getCredentialByTag);
router.post("/getCredentialById", credential_controller.getCredentialById);
router.post("/getAllCredentials", credential_controller.getAllCredentials);
router.post("/getalltags", credential_controller.getAllTags);

module.exports = router;
