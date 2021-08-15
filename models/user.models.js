const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error(`The "${email}" is not of email type`);
            }
        }
    },
    phone: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    role: {
        type: mongoose.SchemaTypes.String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    phoneOTP: {
        type: mongoose.SchemaTypes.String
    }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);