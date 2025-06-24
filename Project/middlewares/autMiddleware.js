const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'gizli kelime', (err, decodedToken) => {
            if (err) {
                next()
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        next();
    }
};

module.exports = { requireAuth };
