const router = require("express").Router();

const checkAuth = require('../middlewares/checkAuth');
const checkAdmin = require("../middlewares/checkAdmin");


const {
    fetchCurrentUser,
    loginUser,
    registerUser,
    verifyOTP,
    handleAdmin
} = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify_otp', verifyOTP);
router.get("/me", checkAuth, fetchCurrentUser);
router.get("/admin", checkAuth, checkAdmin, handleAdmin);

module.exports = router;