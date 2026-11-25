const { supabase, isConfigured, devStore } = require('../config/database');

const authController = {
  /**
   * POST /api/auth/register
   * Creates or syncs user in public.users table
   */
  async register(req, res, next) {
    try {
      const { id, email, fullName, phone, role } = req.body;

      if (!id || !email) {
        return res.status(400).json({
          success: false,
          error: 'User ID and email are required.',
        });
      }

      const validRoles = ['candidate', 'parent', 'job_coach', 'administrator'];
      const userRole = validRoles.includes(role) ? role : 'candidate';

      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('users')
          .upsert({
            id,
            full_name: fullName || 'Candidate',
            email,
            phone: phone || null,
            role: userRole,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return res.status(201).json({ success: true, data });
      }

      // Dev Store Fallback
      const newUser = {
        id,
        full_name: fullName || 'Candidate',
        email,
        phone: phone || null,
        role: userRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      devStore.users.set(id, newUser);

      return res.status(201).json({
        success: true,
        data: newUser,
        message: 'User registered in development store.',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/auth/me
   * Returns current authenticated user record
   */
  async getMe(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'User not authenticated.' });
      }

      if (isConfigured && supabase) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        return res.json({ success: true, data });
      }

      // Dev Store Fallback
      const user = devStore.users.get(userId) || req.user;
      return res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
