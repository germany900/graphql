const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = {
    login: async(email, password, secretKey) => {
        const user = await User.findOne({ email: email })
        if (!user) return { error: 'El Usuario o la Contraseña son inconrrectos...' }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return { error: 'El Usuario o la Contraseña son inconrrectos...' }

        const token = await jwt.sign({
            _id: user._id,
            name: user.name,
            date: user.date
        }, secretKey)

        return { message: 'Login Correcto', token: token }
    },
    checkHeaders: (req, res, next) => {
        const token = req.header('Authorization');
        const jwtToken = token.split(' ')[1]
        if (jwtToken) {
            try {
                const payload = jwt.verify(jwtToken, '1234');
                req.user = payload
                req.user.auth = true
                return next();
            } catch (e) {
                console.log(e.message);
                req.user = { auth: false }
                return next();
            }
        } else {
            req.user = { auth: false }
            return next();
        }
    }
}

module.exports = auth