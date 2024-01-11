module.exports = async function(req, res, authData) {

    res.status(200).json({
        message: "Authorized "+ req.authData
    });
}