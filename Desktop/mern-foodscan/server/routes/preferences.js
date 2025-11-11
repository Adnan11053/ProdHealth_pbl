const express = require('express'); const router = express.Router(); const auth = require('../middleware/auth'); const User = require('../models/User');
router.get('/', auth, async (req,res)=>{ const u = await User.findById(req.user.id); res.json(u.preferences || {}); });
router.post('/', auth, async (req,res)=>{ const u = await User.findById(req.user.id); u.preferences = req.body; await u.save(); res.json({msg:'saved'}); });
module.exports = router;
