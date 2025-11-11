const mongoose = require('mongoose');
const ScanSchema = new mongoose.Schema({ user:{type:mongoose.Schema.Types.ObjectId, ref:'User'}, barcode:String, product:{type:mongoose.Schema.Types.ObjectId, ref:'Product'}, result:Object }, {timestamps:true});
module.exports = mongoose.model('Scan', ScanSchema);
