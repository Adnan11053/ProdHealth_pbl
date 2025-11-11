const mongoose = require('mongoose');
const Pref = new mongoose.Schema({ dietType:String, allergens:[String], healthPriorities:[String], goals:[String], otherPreferences:[String], thresholds:{ sugar_100g:Number, salt_100g:Number, fat_100g:Number, calories_100g:Number } }, {_id:false});
const UserSchema = new mongoose.Schema({ name:String, email:{type:String,unique:true}, password:String, preferences:{ type: Pref, default: () => ({ dietType:'none', allergens:[], healthPriorities:[], goals:[], otherPreferences:[], thresholds:{ sugar_100g:10, salt_100g:1, fat_100g:17, calories_100g:400 } }) } }, {timestamps:true});
module.exports = mongoose.model('User', UserSchema);
