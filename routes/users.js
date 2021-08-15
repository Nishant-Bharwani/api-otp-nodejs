const router = require('express').Router();
const User = require('../models/user.models');
const bcrypt = require('bcryptjs');

const checkAuth = require('../middlewares/checkAuth');
const { WRONG_USER_DATA } = require('../errors');

router.put('/:id', checkAuth, async(req, res) => {
    const currentUser = res.locals.user;
    console.log(currentUser._id, req.params.id);
    if (currentUser._id == req.params.id || currentUser.role === "ADMIN") {
        if (req.body.password) {
            req.body.password = await (await bcrypt.hash(req.body.password, 10)).toString();
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(400).json(WRONG_USER_DATA);
    }
});


// Delete

router.delete("/:id", checkAuth, async(req, res) => {
    const currentUser = res.locals.user;
    if (currentUser._id === req.params.id || currentUser.role === "ADMIN") {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json(WRONG_USER_DATA);
    }
});


// Get

router.get('/find/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc;
        res.status(200).json(info);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/', checkAuth, async(req, res) => {
    console.log(req.user);
    const currentUser = res.locals.user;
    const query = req.query.new;
    if (currentUser.role === "ADMIN") {
        try {
            const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json('This action is not allowed');
    }
});

module.exports = router;