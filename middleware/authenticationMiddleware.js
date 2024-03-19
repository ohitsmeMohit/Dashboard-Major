// // authenticationMiddleware.js

// const authenticateMiddleware = (req, res, next) => {
//   // Check if user is authenticated (i.e., session contains userId)
//   if (req.session && req.session.userId) {
//     next(); // User is authenticated, continue to next middleware
//   } else {
//     // User is not authenticated, redirect to login page
//     res.redirect('/login.html');
//   }
// };

// module.exports = authenticateMiddleware;
// authMiddleware.js

// Middleware function to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // Check if user session contains authentication data
  if (req.session && req.session.user) {
    // User is authenticated, proceed to next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/login.html');
  }
};

module.exports = isAuthenticated;
