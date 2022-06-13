
const router = require("express").Router();

const {
		recordDisplayPage,
		addRecordPage,
		addRecord,
		recordEditPage,
		editRecord,
		recordDeletePage
		} = require("../controllers/courseController");

const {isLoggedin, isNotLoggedin} = require('../lib/check_authentication');
const validator = require('../lib/validation_rules'); 

router.get('/pages/display', isLoggedin, recordDisplayPage);

router.get('/pages/add', isLoggedin, addRecordPage);
router.post('/pages/add', isLoggedin, addRecord);

router.get('/pages/edit/:id', isLoggedin, recordEditPage);
router.get('/pages/delete/:id', isLoggedin, recordDeletePage);

module.exports = router;