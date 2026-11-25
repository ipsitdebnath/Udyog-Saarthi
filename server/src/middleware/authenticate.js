const { supabase, isConfigured, devStore } = require('../config/database');

/**
 * Authentication Middleware:
 * Extracts bearer token and verifies the user identity via Supabase Auth or Dev Store
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header missing or invalid. Format: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];

    if (isConfigured && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired session token.',
        });
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || 'candidate',
        fullName: user.user_metadata?.full_name,
        phone: user.user_metadata?.phone,
      };
      return next();
    }

    // Development fallback authentication
    if (token.startsWith('mock-') || token === 'test-token') {
      // Find first user or default candidate
      const defaultUser = devStore.users.get('00000000-0000-0000-0000-000000000001');
      req.user = defaultUser;
      return next();
    }

    // Default mock user for testing
    req.user = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'aarav.candidate@example.gov.in',
      role: 'candidate',
      fullName: 'Aarav Sharma',
      phone: '9876543210',
    };
    return next();
  } catch (err) {
    console.error('[AuthMiddleware] Error:', err);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed.',
    });
  }
}

module.exports = authenticate;
