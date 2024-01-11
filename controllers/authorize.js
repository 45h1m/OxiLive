const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){

    if(!req.cookies.token) return res.status(401).json({
        error: "Missing token",
        message: "Missing token"
    });

    jwt.verify(
        req.cookies.token, 
        process.env.JWT_SECRET,
        (err, authData) => {

            if(err) {
                return res.status(401).json({
                    error: "Invalid token",
                    message: "Invalid token"
                });
            }
            
            req.authData = authData;
            next();
        }
    );


}