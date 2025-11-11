const mongoose = require('mongoose');
module.exports = async function connectDB(){
  if(!process.env.MONGO_URI){ console.error('Missing MONGO_URI'); process.exit(1); }
  try{ await mongoose.connect(process.env.MONGO_URI); console.log('Mongo connected'); }catch(e){ console.error(e); process.exit(1); }
}
