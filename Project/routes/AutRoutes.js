const router = require('express').Router();
const autController = require('../controllers/autController')
router.get('/guvenliindex',autController.guvenliindex_get);
router.get('/guvenliabout',autController.guvenliabout_get);
router.get('/login',autController.login_get);
router.post('/login',autController.login_post);
router.get('/signup',autController.signup_get);
router.post('/signup', autController.signup_post);
router.get('/logout',autController.logout_get);
module.exports = router;
