const jwt = require('jsonwebtoken'); //verify the token that was created in login

module.exports = (req, res, next) => { //middilewqare function
    const token = req.cookies.token; //jwt token stored in cookie after login

    if (!token) { // if there is no token, user is not logged in
        req.flash('error', 'Please login to continue.'); //flash message please login
        return res.redirect('/login'); // we send user back to login page 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verfies the token with secretkey 
        req.userId = decoded.id; //extract user id from token
        next(); // this is how we fetch only that users notes.
    } catch {
        req.flash('error', 'Session expired. Please login again.');
        res.redirect('/login'); // if seccion expired user redireted to logi again like UMS
    }
};
