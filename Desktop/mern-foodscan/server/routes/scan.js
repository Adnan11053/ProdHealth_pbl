const express = require('express'); const axios = require('axios'); const router = express.Router(); const auth = require('../middleware/auth'); const Product = require('../models/Product'); const Scan = require('../models/Scan'); const User = require('../models/User');

function calcHealthScore(nutrition={}, prefs={}){
  let score = 100; const t = prefs.thresholds || {sugar_100g:10, salt_100g:1, fat_100g:17, calories_100g:400};
  if(nutrition.sugars_100g && nutrition.sugars_100g > t.sugar_100g) score -= 25;
  if(nutrition.salt_100g && nutrition.salt_100g > t.salt_100g) score -= 20;
  if(nutrition.fat_100g && nutrition.fat_100g > t.fat_100g) score -= 20;
  if(nutrition.energy_kcal_100g && nutrition.energy_kcal_100g > t.calories_100g) score -= 15;
  if(score<0) score = 0; if(score>100) score=100;
  return { score, label: score>=70?'Healthy':score>=45?'Moderate':'Unhealthy', color: score>=70?'green':score>=45?'yellow':'red' };
}

function mapOFF(off){
  const p = off.product||{}; const n = p.nutriments||{};
  return {
    barcode: p.code||p._id, name: p.product_name||'Unknown', brand: (p.brands||'').split(',')[0], image:p.image_front_url||'', category:(p.categories||'').split(',')[0]||'other',
    ingredients:(p.ingredients_text||'').split(',').map(s=>s.trim()).filter(Boolean),
    allergens:(p.allergens_tags||[]).map(a=>a.replace('en:','')),
    nutrition: { fat_100g: Number(n.fat_100g)||undefined, sugars_100g: Number(n.sugars_100g)||undefined, salt_100g: Number(n.salt_100g)||(n.sodium_100g?Number(n.sodium_100g)*2.5:undefined), proteins_100g:Number(n.proteins_100g)||undefined, energy_kcal_100g:Number(n['energy-kcal_100g'])||undefined }
  };
}

function containsAllergen(product, allergen){
  const check = allergen.toLowerCase(); const ingr = (product.ingredients||[]).join(' ').toLowerCase(); const tags = (product.allergens||[]).join(' ').toLowerCase();
  return ingr.includes(check) || tags.includes(check);
}

router.post('/', auth, async (req,res)=>{
  try{
    const { barcode } = req.body; if(!barcode) return res.status(400).json({msg:'barcode required'});
    const user = await User.findById(req.user.id); const prefs = user.preferences || {};
    let product = await Product.findOne({ barcode });
    if(!product){
      const off = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`).then(r=>r.data);
      if(!off || off.status !== 1) return res.status(404).json({msg:'Not found in OFF'});
      const mapped = mapOFF(off);
      product = await Product.create({ ...mapped, healthScore:0, alternatives:[] });
    }
    const analysis = calcHealthScore(product.nutrition, prefs);
    const userAllergens = prefs.allergens || [];
    for(let a of userAllergens) if(a && containsAllergen(product, a)) analysis.score -= 40;
    if(analysis.score<0) analysis.score=0;
    product.healthScore = Math.round(analysis.score); await product.save();
    await Scan.create({ user: req.user.id, barcode, product: product._id, result: analysis });
    const alts = await Product.find({ category: product.category, barcode: { $ne: product.barcode } }).limit(250);
    function scoreAlt(alt){ let s = calcHealthScore(alt.nutrition, prefs).score; for(let a of userAllergens) if(a && containsAllergen(alt,a)) s -= 40; return Math.max(0, Math.round(s)); }
    const scored = alts.map(a=>({alt,score:scoreAlt(a)})).filter(x=>x.score>=analysis.score).sort((a,b)=>b.score-a.score).slice(0,6).map(s=>({...s.alt.toObject(), healthScore: s.score}));
    return res.json({ product, analysis, alternatives: scored });
  }catch(e){ console.error(e); return res.status(500).json({msg:'err'}); }
});

module.exports = router;
