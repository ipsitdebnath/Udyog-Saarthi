/**
 * Role-Based Authorization Middleware
 * @param  {...string} allowedRoles
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: User authentication required.',
      });
    }

    const userRole = req.user.role || 'candidate';
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Access restricted for role [${userRole}]. Required: [${allowedRoles.join(', ')}]`,
      });
    }

    next();
  };
}

module.exports = authorize;
