const { articleDisplay, articleAdd, toBeValid, detailDisplay } = require("../controllers/article");
const { isLoggedin } = require("../middleware/auth");

const router = require("express").Router();

router.get('/view/article', /* isLoggedin, */ articleDisplay);
// router.get('/view/article/list', isLoggedin, recordDisplayPage);
router.get('/view/article/detail', isLoggedin, detailDisplay);
router.get('/view/article/tobevalid', /* isLoggedin, */ toBeValid);
router.post('/article/add', /* isLoggedin, */ articleAdd);
router.get('/home', function(req, res, next) {
    res.render('index');
 });

module.exports = router;