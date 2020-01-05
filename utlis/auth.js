const bcrypt = require('bcrypt');
const User = require('../models/user');

const auth = {
    login: async(email, password, secretKey) => {
        const user = await User.findOne({ email: email })
        if (!user) return { error: 'El Usuario o la Contraseña son inconrrectos...' }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return { error: 'El Usuario o la Contraseña son inconrrectos...' }
        return { message: 'Login Correcto' }
    }
}

module.exports = auth