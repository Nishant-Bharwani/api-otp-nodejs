const bcrypt = require('bcryptjs');

exports.hashPassword = async(str) => {
    let hash = await bcrypt.hash(str, 10);
    return hash;
};