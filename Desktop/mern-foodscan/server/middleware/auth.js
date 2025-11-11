const jwt = require('jsonwebtoken');
module.exports = function(req,res,next){
  const token = req.header('Authorization')?.replace('Bearer ',''); if(!token) return res.status(401).json({msg:'No token'});
  try{ const d = jwt.verify(token, process.env.JWT_SECRET); req.user = d.user; next(); }catch(e){ return res.status(401).json({msg:'Invalid token'}); }
}
