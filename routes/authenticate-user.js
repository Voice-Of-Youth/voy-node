const router = require("express").Router();
const { body } = require("express-validator");

/* pages route */
const {
		homePage,
		register,
		registerPage,
		login,
		loginPage,
		forgotPassword,
		sendResetPassLink,
		resetPasswordPage,
		resetPassword
		} = require("../controllers/authController");


const {isLoggedin, isNotLoggedin} = require('../lib/check_authentication');
const validator = require('../lib/validation_rules');

router.get('/', homePage);

router.get("/auth/login", isNotLoggedin, loginPage);
router.post("/auth/login", isNotLoggedin, validator.validationRules[0], homePage);

router.get("/auth/signup", isNotLoggedin, registerPage);
router.post("/auth/signup", isNotLoggedin, validator.validationRules[1], homePage);

router.get('/logout', 
		(req, res, next) => {
				req.session.destroy(
						(err) => {
							next(err);
							}
					);
		res.redirect('/auth/login');
	}
);

router.get("/auth/forgotpassword", isNotLoggedin, forgotPassword);
router.post("/auth/forgotpassword", isNotLoggedin, sendResetPassLink);

router.get("/reset-password", isNotLoggedin, resetPasswordPage);
router.post("/reset-password", isNotLoggedin, validator.validationRules[3], resetPassword);

module.exports = router;