// authenticationMiddleware.js

const authenticateMiddleware = (req, res, next) => {
  // Check if user is authenticated (i.e., session contains userId)
  if (req.session && req.session.userId) {
    next(); // User is authenticated, continue to next middleware
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/login.html');
  }
};

module.exports = authenticateMiddleware;
