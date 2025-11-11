const express = require('express'); const router = express.Router(); const auth = require('../middleware/auth'); const Scan = require('../models/Scan');
router.get('/', auth, async (req,res)=>{ const scans = await Scan.find({user:req.user.id}).populate('product').sort({createdAt:-1}).limit(50); res.json(scans); });
module.exports = router;
