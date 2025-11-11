const mongoose = require('mongoose');
const NutritionSchema = new mongoose.Schema({ fat_100g:Number, sugars_100g:Number, salt_100g:Number, proteins_100g:Number, energy_kcal_100g:Number }, {_id:false});
const ProductSchema = new mongoose.Schema({ barcode:{type:String,unique:true}, name:String, brand:String, image:String, category:String, ingredients:[String], allergens:[String], nutrition:NutritionSchema, healthScore:Number, alternatives:[String] }, {timestamps:true});
module.exports = mongoose.model('Product', ProductSchema);
