const studentModel = require('../models/model');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
        try {
            const hasAuthorization = req.headers.authorization; 
    if (!hasAuthorization) {
        return res.status(400).json({
            message: 'Not authorized'
        })
    }
    const token = hasAuthorization.split(' ')[1]
    if (!token) {
        return res.status(404).json({
            message: 'Token not found'
        })
    }
    const decodeToken = jwt.verify(token, process.env.secret); 
    if (!decodeToken) {
        return res.status(400).json({
            message: 'Not authorized'
        })
    }
    const user = await studentModel.findById(decodeToken.userId); 
    if (!user) {
        return res.status(400).json({
            message: 'Authorization falied: Please login to continue'
        })
    }

    if (user.blacklist.includes(token)) {
        return res.status(400).json({
            message: 'Authorization Falied: Please login to continue'
        })
    }
    req.user = decodeToken

    next()

        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError){
                return res.status(501).json({
                    message: 'Session timeout, please login to continue',
                })
            }
                return res.status(500).json({
                    message: 'Error authenticating: ' + err.message
                })
        }
    }



// Authorized users to getAll
const admin = (req, res, next) => {
    authenticate(req, res, async () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(400).json({
                message: "User not authorized"
            })
        }
    })
}


module.exports = {
    authenticate, 
    admin, 
}; 