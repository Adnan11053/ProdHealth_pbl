const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

async function fetchPage(page){
  const url='https://world.openfoodfacts.org/cgi/search.pl';
  const params = { search_terms:'', tagtype_0:'countries', tag_contains_0:'contains', tag_0:'india', page_size:100, page, json:1 };
  const res = await axios.get(url,{params,timeout:20000});
  return res.data;
}

function mapOFFProduct(p){
  const n = p.nutriments || {};
  const ingredients = (p.ingredients_text||'').split(',').map(s=>s.trim()).filter(Boolean);
  const allergens = (p.allergens_tags||[]).map(a=>a.replace('en:','').replace('fr:',''));
  return { 
    barcode: p.code||p._id||null, 
    name: p.product_name||p.generic_name||'Unknown', 
    brand:(p.brands||'').split(',')[0].trim(), 
    image:p.image_front_url||'', 
    category:(p.categories||'').split(',')[0]||'other', 
    ingredients, 
    allergens, 
    nutrition:{ 
      fat_100g: Number(n.fat_100g)||undefined, 
      sugars_100g: Number(n.sugars_100g)||undefined, 
      salt_100g: Number(n.salt_100g)||(n.sodium_100g?Number(n.sodium_100g)*2.5:undefined), 
      proteins_100g: Number(n.proteins_100g)||undefined, 
      energy_kcal_100g: Number(n['energy-kcal_100g'])||undefined 
    } 
  };
}

async function run(){
  if(!process.env.MONGO_URI){ console.error('Set MONGO_URI'); process.exit(1); }
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected');
  const seen = new Set(); const toInsert = []; let page=1;
  while(toInsert.length<200 && page<30){
    try{
      const data = await fetchPage(page);
      const products = data.products||[];
      for(let p of products){
        const m = mapOFFProduct(p);
        if(!m.barcode) continue;
        if(seen.has(m.barcode)) continue;
        seen.add(m.barcode);
        toInsert.push(m);
        if(toInsert.length>=200) break;
      }
    }catch(e){ console.error('err',e.message); }
    page++;
  }
  for(let prod of toInsert){
    try{ await Product.updateOne({barcode:prod.barcode},{$set:prod},{upsert:true}); }catch(e){}
  }
  console.log('Done',toInsert.length);
  process.exit(0);
}
run();
