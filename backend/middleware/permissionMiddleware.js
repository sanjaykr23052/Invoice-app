module.exports = (requiredRole) => {
    return async (req, res, next) => {
      try {
        // Admins have full access
        if (req.user instanceof Admin) return next();
  
        // Check user type
        if (!req.user || req.userType !== requiredRole) {
          return res.status(403).json({ 
            message: `Access denied. Requires ${requiredRole} privileges`
          });
        }
        
        next();
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    };
  };