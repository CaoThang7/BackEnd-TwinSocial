const Users = require("../models/userModel")
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        console.log(token);
        token = token.slice(7, token.length);
        if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.json({
                        status: false,
                        msg: "token is invalid",
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.json({
                status: false,
                msg: "Token is not provided",
            });
        }      
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}


module.exports = auth