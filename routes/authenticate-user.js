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
const {validationRules} = require('../lib/validation_rules');

router.get('/', homePage);

router.get("/auth/login", isNotLoggedin, loginPage);
router.post("/auth/login", isNotLoggedin, validationRules[0], login);

router.get("/auth/signup", isNotLoggedin, registerPage);
router.post("/auth/signup", isNotLoggedin, validationRules[1], register);

router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		next(err);
	});
	res.redirect('/');
});

router.get('/article/:id', function(req , res){
	res.render('articles/article' + req.params.id);
});

router.get("/auth/forgotpassword", isNotLoggedin, forgotPassword);
router.post("/auth/forgotpassword", isNotLoggedin, sendResetPassLink);

router.get("/reset-password", isNotLoggedin, resetPasswordPage);
router.post("/reset-password", isNotLoggedin, validationRules[3], resetPassword);

module.exports = router;