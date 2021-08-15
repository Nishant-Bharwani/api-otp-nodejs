const router = require("express").Router();

const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require("../middlewares/checkAdmin");


const {
    fetchCurrentUser,
    loginWithPhoneOtp,
    createNewUser,
    verifyPhoneOtp,
    handleAdmin
} = require('../controllers/auth.controller');

router.post('/register', createNewUser);
router.post('/login', loginWithPhoneOtp);
router.post('/verify_otp', verifyPhoneOtp);
router.get("/me", checkAuth, fetchCurrentUser);
router.get("/admin", checkAuth, checkAdmin, handleAdmin);

module.exports = router;